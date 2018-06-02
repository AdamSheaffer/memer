import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit, Renderer, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, ParamMap } from '@angular/router';
import { IGame, IGameChanges } from '../../interfaces/IGame';
import { IPlayer, IPlayerChanges } from '../../interfaces/IPlayer';
import { ICard } from '../../interfaces/ICard';
import { IMessage } from '../../interfaces/IMessage';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { DeckService } from '../../services/deck.service';
import { GameService } from '../../services/game.service';
import { GiphyService } from '../../services/giphy.service';
import { PlayerService } from '../../services/player.service';
import { ThemeService, Theme } from '../../services/theme.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { switchMap, filter, take, map, skip, takeUntil, combineLatest } from 'rxjs/operators';

@Component({
  selector: 'memer-gameroom',
  templateUrl: './gameroom.component.html',
  styleUrls: ['./gameroom.component.scss']
})
export class GameroomComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chat', { read: ElementRef }) chatEl: ElementRef;
  destroy$: Subject<boolean> = new Subject<boolean>();
  gameId: string;
  cardsInHand = 7;
  collapsed = false;
  isWinningModalShown: boolean;
  currentUser: IPlayer;
  game$: Observable<IGame>;
  players$: Observable<IPlayer[]>;
  gameState: IGame;
  playerState: IPlayer[];
  get isCurrentUsersTurn() { return this.gameState.turn === this.currentUser.uid; }
  get isHost() { return this.gameState.hostId === this.currentUser.uid; }
  get isUpForVoting(): boolean { return !!this.gameState && !!this.gameState.gifSelectionURL; }
  get isDarkTheme() { return this.themeService.theme === Theme.DARK; }

  constructor(
    private authService: AuthService,
    private deckService: DeckService,
    private gameService: GameService,
    private giphyService: GiphyService,
    private playerService: PlayerService,
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
      this.game$ = this.gameService.init(this.gameId);
      this.game$.pipe(take(1)).subscribe(g => {
        this.players$ = this.playerService.init(this.gameId, this.currentUser.uid);
        this.deckService.init(this.gameId);
        this.playerService.join(this.currentUser, g.hasStarted)
          .then(pid => this.currentUser.gameAssignedId = pid)
          .catch(err => this.returnHomeWithMessage(err.message));
        this.trackGameEvents();
        this.players$.pipe(takeUntil(this.destroy$)).subscribe(p => this.playerState = p); // keep copy of players state
      });
      this.game$.pipe(takeUntil(this.destroy$)).subscribe(game => this.gameState = game); // keep copy of game state
    });
  }

  // To position the chat at the bottom
  ngAfterViewInit(): void {
    const el = this.chatEl.nativeElement.getElementsByClassName('nav-content')[0];
    this.renderer.setElementStyle(el, 'flex-direction', 'column-reverse');
  }

  beginGame() {
    this.deckService.setDeck().then(() => {
      const playerCount = this.playerState.length;

      this.deckService.getCards(this.cardsInHand * playerCount)
        .then(cards => {
          this.playerService.dealToAllPlayers(cards, this.cardsInHand);
        });
    });


    this.gameService.updateGame({
      hasStarted: true,
      turn: this.currentUser.uid,
      turnUsername: this.currentUser.username
    });
  }

  beginTurn() {
    if (!this.isCurrentUsersTurn) { return; }

    const tagOptions = this.giphyService.getRandomTags();
    this.gameService.updateGame({ tagOptions });
  }

  selectTag(tagSelection: string) {
    this.giphyService.getRandomImages(tagSelection).then(gifOptionURLs => {
      this.gameService.updateGame({ gifOptionURLs, tagSelection });
    });
  }

  selectGif(gifSelectionURL: string) {
    this.gameService.updateGame({ gifSelectionURL });
  }

  selectCaption(captionPlayed: ICard) {
    const player = this.playerState.find(p => p.uid === this.currentUser.uid);
    const captionIndex = player.captions.findIndex(c => c.id === captionPlayed.id);
    const captions = [...player.captions];
    captions.splice(captionIndex, 1);
    this.deckService.getCards(1).then(cards => {
      captions.push(...cards);
      this.playerService.update(player, { captionPlayed, captions });
    });
  }

  selectFavoriteCaption(player: IPlayer) {
    if (!this.isCurrentUsersTurn || !this.gameState.isVotingRound) { return; }

    const newScore = player.score + 1;
    const hasGameWinner = newScore >= 10;
    this.playerService.update(player, { score: newScore });

    const gameChanges: IGameChanges = { roundWinner: player };

    if (hasGameWinner) {
      gameChanges.winner = player;
    }

    this.gameService.updateGame(gameChanges).then(() => {
      setTimeout(() => {
        if (!hasGameWinner) {
          this.startNewRound();
        }
      }, 5000);
    });
  }

  startNewRound() {
    const playerChanges: IPlayerChanges = {};
    const gameChanges: IGameChanges = {};
    const players = [...this.playerState];

    playerChanges.captionPlayed = null;

    const nextPlayer = this.findNextPlayer();

    gameChanges.gifOptionURLs = [];
    gameChanges.gifSelectionURL = null;
    gameChanges.tagOptions = [];
    gameChanges.tagSelection = null;
    gameChanges.isVotingRound = false;
    gameChanges.roundWinner = null;
    gameChanges.turn = nextPlayer.uid;
    gameChanges.turnUsername = nextPlayer.username;

    this.playerService.updateAll(players, playerChanges);
    this.gameService.updateGame(gameChanges);
  }

  private findNextPlayer() {
    const index = this.playerState.findIndex(p => {
      return this.gameState.turn === p.uid;
    });

    const isLastPlayerToGo = index === this.playerState.length - 1;
    if (isLastPlayerToGo) {
      return this.playerState[0];
    }

    return this.playerState[index + 1];
  }

  async resetGame() {
    const gameChanges: IGameChanges = {
      tagOptions: [],
      tagSelection: null,
      gifOptionURLs: [],
      isVotingRound: false,
      roundWinner: null,
      winner: null,
      gifSelectionURL: null
    };

    const players = [...this.playerState];
    const playerChanges: IPlayerChanges = {
      captionPlayed: null,
      score: 0,
      captions: []
    };

    const playersUpdated = this.playerService.updateAll(players, playerChanges);
    const gameUpdated = this.gameService.updateGame(gameChanges);

    await Promise.all([playersUpdated, gameUpdated]);

    this.beginGame();
  }

  removePlayer(player: IPlayer) {
    if (!this.isHost) { return; }

    this.playerService.remove(player);
  }

  /*********************/
  /**** GAME EVENTS ****/
  /*********************/
  private trackGameEvents() {
    this.trackVotingRound(); // Everyone has played. Voting Round Begins
    this.trackPlayerRemoval();
  }

  private trackPlayerRemoval() {
    this.players$.pipe(
      skip(1), // This will fire when you a player enters. Skip this
      filter(players => !players.find(p => p.uid === this.currentUser.uid))
    ).subscribe(() => {
      this.returnHomeWithMessage('You\'ve been removed from the game');
    });
  }

  private trackVotingRound() {
    this.players$.pipe(
      combineLatest(this.game$),
      filter(([players, game]) => this.everyoneSubmittedCaption(players, game)),
      takeUntil(this.destroy$)
    ).subscribe(([players, game]) => {
      this.gameService.updateGame({ isVotingRound: true });
    });
  }

  private everyoneSubmittedCaption(players: IPlayer[], game: IGame) {
    const playersNotSelected = players.filter(p => !p.captionPlayed);

    return playersNotSelected.length === 1 &&
      playersNotSelected[0].uid === game.turn;
  }

  private returnHomeWithMessage(message?: string) {
    this.router.navigate(['/']).then(() => {
      if (message) { alert(message); }
    });
  }

  private leaveGame() {
    const player = this.playerState.find(p => p.uid === this.currentUser.uid);
    const nextActivePlayer = this.playerState.find(p => p.isActive);
    const gameChanges: IGameChanges = {};
    player.isActive = false;

    if (this.isCurrentUsersTurn) {
      gameChanges.turn = nextActivePlayer.uid;
      gameChanges.turnUsername = nextActivePlayer.username;
    }

    if (this.isHost) {
      gameChanges.hostId = nextActivePlayer.uid;
    }

    this.playerService.update(player, { isActive: false });

    if (Object.keys(gameChanges).length) {
      this.gameService.updateGame(gameChanges);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.leaveGame();
  }

  ngOnDestroy() {
    this.leaveGame();
    this.destroy$.next(true);
    // 🔥 🔥 🔥 🚬 burn the whole thing down and leave no trace behind...
    this.destroy$.complete();
  }
}
