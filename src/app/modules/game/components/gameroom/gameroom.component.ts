import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, take, map, skip, takeUntil } from 'rxjs/operators';
import { Player, Game, Card, GameChanges, IPlayerChanges } from '../../../../interfaces';
import { Theme, AuthService, ThemeService, GameService, PlayerService } from '../../../core/services';
import { ChatService, DeckService, GiphyService, CategoryService } from '../../services';
import * as firebase from 'firebase/app';

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
  currentUser: Player;
  maxPlayers: number;
  pointsToWin: number;
  sfw: boolean;
  game$: Observable<Game>;
  players$: Observable<Player[]>;
  cards$: Observable<Card[]>;
  gameState: Game;
  playerState: Player[];
  get isCurrentUsersTurn() { return this.gameState.turn === this.currentUser.uid; }
  get isHost() { return this.gameState.hostId === this.currentUser.uid; }
  get isUpForVoting(): boolean { return !!this.gameState && !!this.gameState.gifSelectionURL; }
  get isDarkTheme() { return this.themeService.theme === Theme.DARK; }

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private chatService: ChatService,
    private deckService: DeckService,
    private gameService: GameService,
    private giphyService: GiphyService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private renderer: Renderer2
  ) {
    this.currentUser = this.authService.getPlayer();
  }

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      this.gameId = id;
      this.game$ = this.gameService.init(this.gameId);
      this.game$.pipe(take(1)).subscribe(g => {
        this.maxPlayers = g.maxPlayers;
        this.pointsToWin = g.pointsToWin;
        this.sfw = g.safeForWork;
        this.players$ = this.playerService.init(this.gameId, this.currentUser.uid);
        this.deckService.init(this.gameId);
        this.playerService.join(this.currentUser, g.hasStarted)
          .then(pid => {
            let isHost = g.hostId === this.currentUser.uid;
            if (!g.hostId) {
              // If user joins a game with no host, they are the host
              this.gameService.updateGame({ hostId: this.currentUser.uid });
              isHost = true;
            }
            if (isHost) { this.trackGameFull(); }
            const playerJoinedMsg = `${this.currentUser.username.toUpperCase()} JOINED THE GAME`;
            this.chatService.postAdminMessage(playerJoinedMsg);
            this.currentUser.gameAssignedId = pid;
            this.cards$ = this.playerService.getCurrentPlayersHand(pid, this.cardsInHand).pipe(takeUntil(this.destroy$));
          })
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
    this.renderer.setStyle(el, 'flex-direction', 'column-reverse');
  }

  beginGame() {
    const playerIds = this.playerState.map(p => p.gameAssignedId);
    const playerCount = playerIds.length;
    const getShuffledDeckPromise = this.deckService.getShuffledDeck(this.sfw);
    const emptyHandsPromise = this.playerService.emptyAllPlayerHands(playerIds);

    Promise.all([getShuffledDeckPromise, emptyHandsPromise]).then(results => {
      const [shuffledDeck] = results;
      const allHands = this.deckService.createPlayerHandsFromDeck(shuffledDeck, playerCount);
      this.playerService.dealToAllPlayers(playerIds, allHands);
      this.gameService.updateGame({
        hasStarted: true,
        turn: this.currentUser.uid,
        turnUsername: this.currentUser.username
      });
    });
  }

  beginTurn() {
    if (!this.isCurrentUsersTurn) { return; }

    this.categoryService.getNCategories(4)
      .then(categories => {
        const tagOptions = categories.map(c => c.description);
        const lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
        this.gameService.updateGame({ tagOptions, lastUpdated });
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

  selectCaption(captionPlayed: Card) {
    const player = this.playerState.find(p => p.uid === this.currentUser.uid);
    this.playerService.submitCaption(player.gameAssignedId, captionPlayed)
      .then(() => {
        this.playerService.update(player, { captionPlayed });
      });
  }

  selectFavoriteCaption(player: Player) {
    if (!this.isCurrentUsersTurn || !this.gameState.isVotingRound) { return; }

    const newScore = player.score + 1;
    const hasGameWinner = newScore >= this.pointsToWin;
    this.playerService.update(player, { score: newScore });

    const gameChanges: GameChanges = { roundWinner: player };

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
    const gameChanges: GameChanges = {};
    const players = [...this.playerState];

    playerChanges.captionPlayed = null;

    const nextPlayer = this.findNextPlayer();
    const nextPlayerUid = nextPlayer ? nextPlayer.uid : null;
    const nextPlayerUsername = nextPlayer ? nextPlayer.username : null;

    gameChanges.gifOptionURLs = [];
    gameChanges.gifSelectionURL = null;
    gameChanges.tagOptions = [];
    gameChanges.tagSelection = null;
    gameChanges.isVotingRound = false;
    gameChanges.roundWinner = null;
    gameChanges.turn = nextPlayerUid;
    gameChanges.turnUsername = nextPlayerUsername;

    this.playerService.updateAll(players, playerChanges);
    this.gameService.updateGame(gameChanges);
  }

  private findNextPlayer() {
    let index = this.playerState.findIndex(p => {
      return this.gameState.turn === p.uid;
    });

    while (index < this.playerState.length - 1) {
      index++;
      const nextPlayer = this.playerState[index];
      if (nextPlayer.isActive) {
        return nextPlayer;
      }
    }

    return this.playerState.find(p => p.isActive);
  }

  async resetGame() {
    const gameChanges: GameChanges = {
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
      score: 0
    };

    const playersUpdated = this.playerService.updateAll(players, playerChanges);
    const gameUpdated = this.gameService.updateGame(gameChanges);

    await Promise.all([playersUpdated, gameUpdated]);

    this.beginGame();
  }

  removePlayer(player: Player) {
    if (!this.isHost) { return; }

    this.playerService.remove(player).then(() => {
      this.chatService.postAdminMessage(`${player.username.toUpperCase()} WAS REMOVED`);
    });
  }

  private returnHomeWithMessage(message?: string) {
    this.router.navigate(['/']).then(() => {
      if (message) { alert(message); }
    });
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
      filter(players => !players.find(p => p.uid === this.currentUser.uid)),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.returnHomeWithMessage('You\'ve been removed from the game');
    });
  }

  private trackVotingRound() {
    combineLatest(this.players$, this.game$).pipe(
      filter(([_p, game]) => !game.isVotingRound),
      filter(([players, game]) => this.everyoneSubmittedCaption(players, game)),
      takeUntil(this.destroy$)
    ).subscribe(([_p, _g]) => {
      this.gameService.updateGame({ isVotingRound: true });
    });
  }

  private trackGameFull() {
    const gameStarted$ = this.getGameStartObservable();
    this.players$.pipe(
      map(this.activeFilterCount),
      filter(count => count >= this.maxPlayers),
      takeUntil(gameStarted$),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.beginGame();
    });
  }

  private getGameStartObservable() {
    return this.game$.pipe(filter(g => g.hasStarted), take(1));
  }

  private activeFilterCount(players: Player[]) {
    if (!players) { return 0; }
    return players.filter(p => p.isActive).length;
  }

  private everyoneSubmittedCaption(players: Player[], game: Game) {
    const playersNotSelected = players.filter(p => !p.captionPlayed && p.isActive);

    return playersNotSelected.length === 1 &&
      playersNotSelected[0].uid === game.turn;
  }

  private leaveGame() {
    if (!this.playerState) { return; }
    const player = this.playerState.find(p => p.uid === this.currentUser.uid);
    player.isActive = false;
    const nextActivePlayer = this.playerState.find(p => p.isActive);
    const nextPlayerId = !!nextActivePlayer ? nextActivePlayer.uid : null;
    const gameChanges: GameChanges = {};

    this.chatService.postAdminMessage(`${player.username.toUpperCase()} HAS LEFT THE GAME`);

    if (this.isCurrentUsersTurn) {
      this.startNewRound();
    }

    if (this.isHost) {
      gameChanges.hostId = nextPlayerId;
      if (nextActivePlayer) {
        this.chatService.postAdminMessage(`${nextActivePlayer.username.toUpperCase()} IS THE NEW HOST`);
      }
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
