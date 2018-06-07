import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GameService, AuthService } from '../../modules/core/services';
import { Game } from '../../interfaces/Game';

@Component({
  selector: 'memer-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showOpenGames = false;
  isLoading = false;
  openGames$: Observable<Game[]>;
  games: Game[] = [];

  constructor(
    private gameService: GameService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

  hostGame() {
    this.showOpenGames = false;
    const user = this.authService.getPlayer();
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

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

}
