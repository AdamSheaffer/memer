import { Component, OnInit } from '@angular/core';
import { IPlayer } from '../../interfaces/IPlayer';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { IGame } from '../../interfaces/IGame';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-gameroom',
  templateUrl: './gameroom.component.html',
  styleUrls: ['./gameroom.component.sass']
})
export class GameroomComponent implements OnInit {

  currentUser: IPlayer;
  game$: Observable<IGame>;
  game: IGame;

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.game$ = this.route.paramMap.switchMap((params: ParamMap) => {
      const gameId = params.get('id')
      return this.gameService.getGameById(params.get('id'));
    });

    this.setup();
  }

  setup() {
    this.game$.subscribe(game => {
      this.game = game;
      const authUser = this.authService.getUser();
      this.currentUser = this.findGameUserById(authUser.uid, game);

      if (!this.currentUser) {
        authUser.isHost = false;
        this.game.players.push(authUser);
        this.updateGame();
      }
    });
  }

  beginGame() {
    if (!this.currentUser.isHost) return;

    this.game.hasStarted = true;
    this.updateGame();
  }

  private updateGame() {
    this.gameService.updateGame(this.game);
  }

  private findGameUserById(uid: string, game: IGame): IPlayer {
    if (!game || !game.players) return;

    return game.players.find(p => p.uid === uid);
  }

}
