import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { GameService, UserService, SettingsService } from '../../modules/core/services';
import { Game } from '../../interfaces/Game';
import { takeUntil } from 'rxjs/operators';
import { Player } from '../../interfaces';

@Component({
  selector: 'memer-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  showOpenGames = false;
  showGameSetup = false;
  isLoading = false;
  openGames$: Observable<Game[]>;
  games: Game[] = [];
  sfw: boolean;
  sfwFilter$: BehaviorSubject<boolean>;
  destroy$ = new Subject<boolean>();
  user: Player;

  constructor(
    private userService: UserService,
    private gameService: GameService,
    private router: Router,
    private settingsService: SettingsService) {
    this.sfw = this.settingsService.safeForWork;
    this.sfwFilter$ = new BehaviorSubject(this.sfw);
  }

  ngOnInit() {
    this.user = this.userService.getPlayer();
  }

  hostGame() {
    this.showGameSetup = true;
  }

  onGameCreated(gameId: string) {
    this.router.navigate([`game/${gameId}`]);
  }

  findOpenGames() {
    this.showOpenGames = true;
    this.isLoading = true;
    this.openGames$ = this.gameService.getOpenGameList(10, this.sfwFilter$);
    this.openGames$.pipe(takeUntil(this.destroy$)).subscribe(g => {
      this.games = g;
      this.isLoading = false;
    });
  }

  joinGame(gameId: string) {
    this.router.navigate([`game/${gameId}`]);
  }

  logout() {
    this.userService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  sfwModeChanged() {
    this.settingsService.setSafeForWorkMode(this.sfw);
    this.sfwFilter$.next(this.sfw);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
