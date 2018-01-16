import { Component, OnInit } from '@angular/core';
import { IPlayer } from '../../interfaces/IPlayer';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { IGame } from '../../interfaces/IGame';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

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

  constructor(
    private authService: AuthService,
    private gameService: GameService,
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
  }

  join() {
    this.game$.take(1).subscribe(g => {
      if (!g.players || !g.players.length) {
        this.currentUser.isHost = true;
        g.turn = this.currentUser.uid;
      }
      g.players.push(this.currentUser);
      this.gameService.updateGame(g);
    });
  }

  beginGame() {
    if (!this.currentUser.isHost) return;

    this.game.hasStarted = true;
    this.updateGame();
  }

  changeTurns() {
    const id = this.findIdOfNextPlayer();
    this.game.turn = id;
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

  private findGameUserById(uid: string, game: IGame): IPlayer {
    if (!game || !game.players) return;

    return game.players.find(p => p.uid === uid);
  }

}
