import { Component, OnInit } from '@angular/core';
import { IPlayer } from '../../interfaces/IPlayer';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { IGame } from '../../interfaces/IGame';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GiphyService } from '../../services/giphy.service';
import 'rxjs/add/operator/single';

@Component({
  selector: 'app-gameroom',
  templateUrl: './gameroom.component.html',
  styleUrls: ['./gameroom.component.sass']
})
export class GameroomComponent implements OnInit {

  currentUser: IPlayer;
  game$: Observable<IGame>;
  gameId: string;
  game: IGame;
  get isUpForVoting() { return !!this.game.gifSelectionURL }

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private giphyService: GiphyService,
    private route: ActivatedRoute) {
    this.currentUser = this.authService.getUser();
  }

  ngOnInit() {
    this.game$ = this.route.paramMap.switchMap((params: ParamMap) => {
      this.gameId = params.get('id');
      return this.gameService.getGameById(this.gameId);
    });

    this.game$.subscribe(g => this.game = g);
    this.join();
    this.trackUserChanges();
  }

  join() {
    this.game$.take(1).subscribe(g => {
      if (!g.players || !g.players.length) {
        this.currentUser.isHost = true;
        g.turn = this.currentUser.uid;
      }
      const existingPlayer = g.players.find(p => this.currentUser.uid === p.uid);
      if (existingPlayer) {
        this.currentUser = existingPlayer;
      } else {
        g.players.push(this.currentUser);
        this.gameService.updateGame(g);
      }
    });
  }

  trackUserChanges() {
    this.game$
      .map(g => g.players.find(p => p.uid === this.currentUser.uid))
      .subscribe(player => this.currentUser = player || this.currentUser);
  }

  beginGame() {
    if (!this.currentUser.isHost) return;

    this.game.hasStarted = true;
    this.updateGame();
  }

  changeTurns() {
    const id = this.findIdOfNextPlayer();
    this.game.turn = id;
    this.resetRound();
    this.updateGame();
  }

  beginTurn() {
    if (!this.isCurrentUsersTurn()) return;

    this.game.tagOptions = this.giphyService.getRandomTags();
    this.updateGame();
  }

  selectTag(tag: string) {
    if (!this.isCurrentUsersTurn()) return;

    this.game.tagSelection = tag;
    this.giphyService.getRandomImages(tag).then(images => {
      this.game.gifOptionURLs = images;
      this.updateGame();
    });
  }

  selectGif(gifUrl: string) {
    if (!this.isCurrentUsersTurn()) return;

    this.game.gifSelectionURL = gifUrl;
    this.updateGame();
  }

  selectCaption(caption: string) {
    if (!this.isUpForVoting || this.isCurrentUsersTurn() || this.currentUser.captionPlayed) return;

    const user = this.findGamePlayerById(this.currentUser.uid);
    const captionIndex = user.captions.indexOf(caption);
    user.captions.splice(captionIndex, 1);
    user.captionPlayed = caption;
    this.updateGame();
  }

  private isCurrentUsersTurn() {
    return this.currentUser.uid === this.game.turn;
  }

  private findIdOfNextPlayer(): string {
    const index = this.game.players.findIndex(p => {
      return this.game.turn === p.uid;
    });

    if (index === this.game.players.length - 1) {
      return this.game.players[0].uid;
    }
    return this.game.players[index + 1].uid;
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
    this.game.players.forEach(p => {
      p.captionPlayed = null;
    });
  }
}
