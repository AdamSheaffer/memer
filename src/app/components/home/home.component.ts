import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { GameService, AuthService } from '../../modules/core/services';
import { Game } from '../../interfaces/Game';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'memer-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  showOpenGames = false;
  isLoading = false;
  openGames$: Observable<Game[]>;
  games: Game[] = [];
  destroy$ = new Subject<boolean>();

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
    this.openGames$.pipe(takeUntil(this.destroy$)).subscribe(g => {
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
