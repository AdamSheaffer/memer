import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { IGame } from '../../interfaces/IGame';

@Component({
  selector: 'memer-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  openGames$: Observable<IGame[]>;
  games: IGame[] = [];

  constructor(
    private gameService: GameService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

  hostGame() {
    const user = this.authService.getUser();
    this.gameService.createNewGame(user)
      .then(gameId => {
        this.router.navigate([`game/${gameId}`]);
      });
  }

  findOpenGames() {
    this.openGames$ = this.gameService.getOpenGameList(10);
    this.openGames$.subscribe(g => this.games = g);
  }

  joinGame(gameId: string) {
    this.router.navigate([`game/${gameId}`]);
  }

}
