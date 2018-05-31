import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit, Renderer, OnDestroy, HostListener } from '@angular/core';
import { IPlayer } from '../../interfaces/IPlayer';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { IGame } from '../../interfaces/IGame';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { GiphyService } from '../../services/giphy.service';
import { ICard } from '../../interfaces/ICard';
import { DeckService } from '../../services/deck.service';
import { IMessage } from '../../interfaces/IMessage';
import { ThemeService, Theme } from '../../services/theme.service';
import { switchMap, filter, take, map, single, skip, takeWhile, takeUntil } from 'rxjs/operators';
import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';

@Component({
  selector: 'memer-gameroom',
  templateUrl: './gameroom.component.html',
  styleUrls: ['./gameroom.component.scss']
})
export class GameroomComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chat', { read: ElementRef }) chatEl: ElementRef;
  gameId: string;
  collapsed = false;
  isWinningModalShown: boolean;
  currentUser: IPlayer;
  game$: Observable<IGame>;
  gameState: IGame;
  gameSubscriptions: Subscription[] = [];
  get isCurrentUsersTurn() { return this.gameState.turn === this.currentUser.uid; }
  get isHost() { return this.gameState.hostId === this.currentUser.uid; }
  get isUpForVoting(): boolean { return !!this.gameState && !!this.gameState.gifSelectionURL; }
  get isDarkTheme() { return this.themeService.theme === Theme.DARK; }

  constructor(
    private authService: AuthService,
    private deckService: DeckService,
    private gameService: GameService,
    private giphyService: GiphyService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private renderer: Renderer
  ) {
    this.currentUser = this.authService.getUser();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.gameId = id;
      this.game$ = this.gameService.joinGameWithId(id, this.currentUser);
      this.track(this.game$.subscribe(g => this.gameState = g));
      this.trackPlayerRemoval();
      this.trackVotingRound();
    });
  }

  // To position the chat at the bottom
  ngAfterViewInit(): void {
    const el = this.chatEl.nativeElement.getElementsByClassName('nav-content')[0];
    this.renderer.setElementStyle(el, 'flex-direction', 'column-reverse');
  }

  beginGame() {
    const captionDeck = this.deckService.getDeck();
    // this.deckService.deal(captionDeck, this.gameState.players, 7);
    this.deckService.init(this.gameId);
    this.gameService.updateGame({
      hasStarted: true,
      players: this.gameState.players,
      captionDeck,
      turn: this.currentUser.uid,
      turnUsername: this.currentUser.username
    });
  }

  beginTurn() {
    if (!this.isCurrentUsersTurn) { return; }

    const tagOptions = this.giphyService.getRandomTags();
    this.gameService.updateGame({ tagOptions }).then(() => {

    });
  }

  selectTag(tagSelection: string) {
    this.giphyService.getRandomImages(tagSelection).then(gifOptionURLs => {
      this.gameService.updateGame({ gifOptionURLs, tagSelection });
    });
  }

  selectGif(gifSelectionURL: string) {
    this.gameService.updateGame({ gifSelectionURL });
  }

  selectCaption(caption: ICard) {
    const players = [...this.gameState.players];
    const deck = [...this.gameState.captionDeck];
    const player = players.find(p => p.uid === this.currentUser.uid);
    const captionIndex = player.captions.findIndex(c => c.top === caption.top && c.bottom === caption.bottom);
    player.captions.splice(captionIndex, 1);
    player.captionPlayed = caption;
    this.deckService.deal(deck, [player], 1);
    this.gameService.updateGame({ players, captionDeck: deck });
  }

  selectFavoriteCaption(player: IPlayer) {
    if (!this.isCurrentUsersTurn || !this.gameState.isVotingRound) { return; }

    player.score += 1;
    const players = this.updatePlayersWithPlayer(player);
    const hasGameWinner = player.score >= 10;
    const changes: any = { players, roundWinner: player };

    if (hasGameWinner) {
      changes.winner = player;
    }

    this.gameService.updateGame(changes).then(() => {
      setTimeout(() => {
        if (!hasGameWinner) {
          this.startNewRound();
        }
      }, 5000);
    });
  }

  startNewRound() {
    const changes: any = {};
    const players = [...this.gameState.players];
    players.forEach(p => p.captionPlayed = null);
    const nextPlayer = this.findNextPlayer();

    changes.gifOptionURLs = [];
    changes.gifSelectionURL = null;
    changes.tagOptions = [];
    changes.tagSelection = null;
    changes.isVotingRound = false;
    changes.roundWinner = null;
    changes.players = players;
    changes.turn = nextPlayer.uid;
    changes.turnUsername = nextPlayer.username;

    this.gameService.updateGame(changes);
  }

  private findNextPlayer() {
    const index = this.gameState.players.findIndex(p => {
      return this.gameState.turn === p.uid;
    });

    if (index === this.gameState.players.length - 1) {
      return this.gameState.players[0];
    }

    return this.gameState.players[index + 1];
  }

  resetGame() {
    const changes: any = {};
    const players = [...this.gameState.players];
    players.forEach(p => {
      p.captions = [];
      p.score = 0;
      p.captionPlayed = null;
    });

    changes.tagOptions = [];
    changes.tagSelection = null;
    changes.gifOptionURLs = [];
    changes.isVotingRound = false;
    changes.roundWinner = null;
    changes.winner = null;
    changes.gifSelectionURL = null;
    changes.players = players;

    this.beginGame();
  }

  removePlayer(player: IPlayer) {
    const players = this.gameState.players;
    const index = players.findIndex(p => p.uid === player.uid);
    players.splice(index, 1);
    this.gameService.updateGame({ players });
  }

  /*********************/
  /**** GAME EVENTS ****/
  /*********************/
  trackPlayerRemoval() {
    const subscription = this.game$.pipe(
      skip(1),
      map(g => g.players),
      filter(players => !players.find(p => p.uid === this.currentUser.uid))
    ).subscribe(p => {
      alert('You have been removed from the game');
      this.router.navigate(['/']);
    });

    this.track(subscription);
  }

  trackVotingRound() {
    const subscription = this.game$.pipe(
      filter(g => !g.isVotingRound),
      filter(this.everyoneSubmittedCaption)
    ).subscribe(g => {
      this.gameService.updateGame({ isVotingRound: true });
    });

    this.track(subscription);
  }

  private track(subscription: Subscription) {
    this.gameSubscriptions.push(subscription);
  }

  private everyoneSubmittedCaption(game: IGame) {
    const players = game.players;
    const playersNotSelected = players.filter(p => !p.captionPlayed);

    return playersNotSelected.length === 1 &&
      playersNotSelected[0].uid === game.turn;
  }

  private updatePlayersWithPlayer(player: IPlayer) {
    const players = [...this.gameState.players];
    const playerIndex = players.findIndex(p => p.uid === player.uid);
    if (playerIndex > -1) {
      players.splice(playerIndex, 1, player);
    }
    return players;
  }

  ngOnDestroy() {
    this.gameSubscriptions.forEach(s => s.unsubscribe());
  }
}
