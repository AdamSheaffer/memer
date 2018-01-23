import { Component, OnInit } from '@angular/core';
import { IPlayer } from '../../interfaces/IPlayer';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { IGame } from '../../interfaces/IGame';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GiphyService } from '../../services/giphy.service';

@Component({
  selector: 'memer-gameroom',
  templateUrl: './gameroom.component.html',
  styleUrls: ['./gameroom.component.scss']
})
export class GameroomComponent implements OnInit {

  currentUser: IPlayer;
  game$: Observable<IGame>;
  gameId: string;
  game: IGame;
  get isUpForVoting(): boolean { return !!this.game && !!this.game.gifSelectionURL }
  get isCurrentUsersTurn(): boolean { return this.currentUser.uid === this.game.turn }

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
    this.trackPlayerChanges();
    this.trackVotingEnd();
  }

  join() {
    this.gameService.join(this.currentUser);
  }

  trackPlayerChanges() {
    this.gameService.currentPlayer(this.currentUser.uid)
      .subscribe(p => this.currentUser = p);
  }

  beginGame() {
    if (!this.currentUser.isHost) return;

    this.game.hasStarted = true;
    this.updateGame();
  }

  changeTurns() {
    const id = this.findIdOfNextPlayer();
    this.game.turn = id;
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

  changeGifIndex(index: number) {
    this.game.gifOptionIndex = index;
    this.updateGame();
  }

  selectGif(gifUrl: string) {
    this.game.gifSelectionURL = gifUrl;
    this.updateGame();
  }

  selectCaption(caption: string) {
    const user = this.findGamePlayerById(this.currentUser.uid);
    const captionIndex = user.captions.indexOf(caption);
    user.captions.splice(captionIndex, 1);
    user.captionPlayed = caption;
    this.updateGame();
  }

  trackVotingEnd() {
    this.gameService.votingEnd()
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
      alert(player.username + ' wins the round');
      setTimeout(() => {
        if (this.game.winner) {
          alert(this.game.winner + ' WINS!');
        } else {
          this.startNewRound();
        }
      }, 5000);
    })
  }

  startNewRound() {
    this.resetRound();
    this.changeTurns();
    this.updateGame();
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
    this.game.isVotingRound = false;
    this.game.roundWinner = null;
    this.game.players.forEach(p => {
      p.captionPlayed = null;
    });
  }

  // TODO: Unsubscribe On Destroy
}
