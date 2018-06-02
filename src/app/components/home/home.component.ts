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
  showOpenGames = false;
  isLoading = false;
  openGames$: Observable<IGame[]>;
  games: IGame[] = [];

  constructor(
    private gameService: GameService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

  hostGame() {
    this.showOpenGames = false;
    const user = this.authService.getUser();
    this.gameService.createNewGame(user)
      .then(gameId => {
        this.router.navigate([`game/${gameId}`]);
      });
  }

  findOpenGames() {
    this.showOpenGames = true;
    this.isLoading = true;
    this.openGames$ = this.gameService.getOpenGameList(10);
    this.openGames$.subscribe(g => {
      this.games = g;
      this.isLoading = false;
    });
  }

  joinGame(gameId: string) {
    this.router.navigate([`game/${gameId}`]);
  }

}
