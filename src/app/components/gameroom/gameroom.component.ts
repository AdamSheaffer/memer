import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit, Renderer, OnDestroy, HostListener } from '@angular/core';
import { IPlayer } from '../../interfaces/IPlayer';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { IGame } from '../../interfaces/IGame';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GiphyService } from '../../services/giphy.service';
import { ICard } from '../../interfaces/ICard';
import { DeckService } from '../../services/deck.service';
import { IMessage } from '../../interfaces/IMessage';
import { ThemeService, Theme } from '../../services/theme.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'memer-gameroom',
  templateUrl: './gameroom.component.html',
  styleUrls: ['./gameroom.component.scss']
})
export class GameroomComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chat', { read: ElementRef }) chatEl: ElementRef;
  collapsed: boolean = false;
  isWinningModalShown: boolean;
  currentUser: IPlayer;
  game$: Observable<IGame>;
  gameId: string;
  game: IGame;
  gameSubscriptions: Subscription[] = [];
  get isDarkTheme(): boolean { return this.themeService.theme === Theme.DARK };
  get isUpForVoting(): boolean { return !!this.game && !!this.game.gifSelectionURL };
  get isCurrentUsersTurn(): boolean { return this.currentUser.uid === this.game.turn };

  constructor(
    private authService: AuthService,
    private deckService: DeckService,
    private gameService: GameService,
    private giphyService: GiphyService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private renderer: Renderer) {
    this.currentUser = this.authService.getUser();
  }

  ngOnInit() {
    this.game$ = this.route.paramMap.switchMap((params: ParamMap) => {
      this.gameId = params.get('id');
      return this.gameService.getGameById(this.gameId);
    });

    this.game$.subscribe(g => {
      if (!g) return this.router.navigate(['/']);
      return this.game = g
    });
    this.join();
  }

  // To position the chat at the bottom
  ngAfterViewInit(): void {
    const el = this.chatEl.nativeElement.getElementsByClassName('nav-content')[0];
    this.renderer.setElementStyle(el, 'flex-direction', 'column-reverse');
  }

  join() {
    return this.game$.take(1).subscribe(g => {
      if (!g) return this.router.navigate(['/']);
      this.currentUser.isHost = false;

      if (!g.players || !g.players.length) {
        this.currentUser.isHost = true;
        g.turn = this.currentUser.uid;
        g.turnUsername = this.currentUser.username;
      }
      const existingPlayer = g.players.find(p => this.currentUser.uid === p.uid);

      if (!existingPlayer && g.hasStarted) return this.router.navigate(['/']);

      if (existingPlayer) {
        this.currentUser = existingPlayer;
        this.currentUser.isActive = true;
      } else {
        g.players.push(this.currentUser);
      }

      this.gameService.updateGame(g);

      this.gameSubscriptions.push(
        this.trackPlayerChanges(),
        this.trackVotingEnd(),
        this.trackLeavingGame(),
      );

    });
  }

  trackPlayerChanges() {
    return this.gameService.currentPlayer(this.currentUser.uid)
      .subscribe(p => this.currentUser = p);
  }

  beginGame() {
    if (!this.currentUser.isHost) return;

    this.game.hasStarted = true;

    this.game.captionDeck = this.deckService.getDeck();
    this.deckService.deal(this.game.captionDeck, this.game.players, 7);
    this.updateGame();
  }

  changeTurns() {
    const player = this.findNextPlayer();
    this.game.turn = player.uid;

    if (!player.isActive) return this.changeTurns();

    this.game.turnUsername = player.username;
  }

  beginTurn() {
    if (!this.isCurrentUsersTurn) return;

    this.game.tagOptions = this.giphyService.getRandomTags();

    this.updateGame();
  }

  selectTag(tag: string) {
    this.game.tagSelection = tag;
    this.giphyService.getRandomImages(tag).then(images => {
      this.game.gifOptionURLs = images;
      this.updateGame();
    });
  }

  selectGif(gifUrl: string) {
    this.game.gifSelectionURL = gifUrl;
    this.updateGame();
  }

  selectCaption(caption: ICard) {
    const user = this.findGamePlayerById(this.currentUser.uid);
    const captionIndex = user.captions.findIndex(c => c.top === caption.top && c.bottom == caption.bottom);
    user.captions.splice(captionIndex, 1);
    user.captionPlayed = caption;
    this.deckService.deal(this.game.captionDeck, [user], 1);
    this.updateGame();
  }

  trackVotingEnd() {
    return this.gameService.votingEnd()
      .subscribe(g => {
        this.game.isVotingRound = true;
        this.updateGame();
      });
  }

  selectFavoriteCaption(player: IPlayer) {
    if (!this.isCurrentUsersTurn || !this.game.isVotingRound) return;

    player.score += 1;
    this.game.roundWinner = player;

    if (player.score >= 10) {
      this.game.winner = player;
    }

    this.updateGame().then(() => {
      setTimeout(() => {
        if (!this.game.winner) {
          this.startNewRound();
        }
      }, 5000);
    });
  }

  startNewRound() {
    this.resetRound();
    this.changeTurns();
    this.updateGame();
  }

  resetGame() {
    this.game.players.forEach(p => {
      p.captions = [];
      p.score = 0;
      p.captionPlayed = null;
    });
    this.game.tagOptions = [];
    this.game.tagSelection = null;
    this.game.gifOptionURLs = [];
    this.game.isVotingRound = false;
    this.game.roundWinner = null;
    this.game.winner = null;
    this.game.gifSelectionURL = null;
    this.updateGame();
  }

  sendMessage(message: IMessage) {
    this.game.messages.push(message);
    this.updateGame();
  }

  removePlayer(player: IPlayer) {
    const playerIndex = this.game.players.findIndex(p => p.uid === player.uid);
    this.game.players.splice(playerIndex, 1);

    if (this.game.turn === player.uid) {
      this.changeTurns();
    }

    this.game.messages.push({
      content: `${player.username} HAS BEEN REMOVED FROM THE GAME`,
      username: 'MEMER',
      userUID: null,
      photoURL: null
    });
    this.updateGame();
  }

  trackPlayerRemoval() {
    this.gameService.userRemoval(this.currentUser.uid)
      .subscribe(() => {
        alert('You\'ve been removed from the game');
        this.router.navigate(['/']);
      });
  }

  trackLeavingGame() {
    return this.router.events
      .filter(e => e instanceof NavigationStart && !e.url.includes(this.gameId))
      .subscribe(() => this.handlePlayerLeaving());
  }

  @HostListener('window:beforeunload', ['$event'])
  leaveOnUnload($event) {
    this.handlePlayerLeaving();
  }

  private handlePlayerLeaving() {
    const player = this.findGamePlayerById(this.currentUser.uid);
    player.isActive = false;
    const playerLeftMsg = this.createSystemChatMessage(`${player.username.toUpperCase()} LEFT THE GAME`);
    this.game.messages.push(playerLeftMsg);
    const nextPlayer = this.game.players.find(p => p.isActive);

    if (this.game.turn == player.uid && !!nextPlayer) {
      this.game.turn = nextPlayer.uid;
      this.game.turnUsername = nextPlayer.username;
    }

    if (player.isHost) {
      player.isHost = false;
      if (nextPlayer) {
        nextPlayer.isHost = true;
        const newHostMsg = this.createSystemChatMessage(`${nextPlayer.username.toUpperCase()} IS THE NEW HOST`);
        this.game.messages.push(newHostMsg);
      }
    }

    // If no one is left in the game, delete the game
    if (!this.gameHasActivePlayers()) {
      this.gameService.deleteGame();
    } else {
      this.updateGame();
    }
  }

  private findNextPlayer(): IPlayer {
    const index = this.game.players.findIndex(p => {
      return this.game.turn === p.uid;
    });

    if (index === this.game.players.length - 1) {
      return this.game.players[0];
    }

    return this.game.players[index + 1];
  }

  private updateGame() {
    return this.gameService.updateGame(this.game);
  }

  private findGamePlayerById(id: string) {
    return this.game.players.find(p => p.uid === id);
  }

  private findGameUserById(uid: string, game: IGame): IPlayer {
    if (!game || !game.players) return;

    return game.players.find(p => p.uid === uid);
  }

  private resetRound() {
    this.game.gifOptionURLs = [];
    this.game.gifSelectionURL = null;
    this.game.tagOptions = [];
    this.game.tagSelection = null;
    this.game.isVotingRound = false;
    this.game.roundWinner = null;
    this.game.players.forEach(p => {
      p.captionPlayed = null;
    });
  }

  private createSystemChatMessage(message: string): IMessage {
    return {
      content: message,
      username: null,
      userUID: null,
      photoURL: null
    }
  }

  private gameHasActivePlayers(): boolean {
    return !!this.game.players.length &&
      !!this.game.players.find(p => p.isActive);
  }

  ngOnDestroy() {
    this.gameSubscriptions.forEach(s => s.unsubscribe());
  }
}
