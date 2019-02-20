import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService, GameService, SettingsService } from '../../modules/core/services';
import { Router } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { FromFBDatePipe } from '../../modules/shared/pipes';
import { By } from '@angular/platform-browser';
import { GameSetupComponent } from '../game-setup/game-setup.component';
import { of } from 'rxjs';
import { Game } from '../../interfaces';

describe('HomeComponent', () => {
  const GAMES: Game[] = [
    {
      id: '1',
      hasStarted: false,
      hostPhotoURL: '/foo.jpg',
      beginDate: null,
      safeForWork: true,
      hostId: 'abc',
      isVotingRound: false,
      tagOptions: [],
      gifOptionURLs: [],
      maxPlayers: 8,
      pointsToWin: 5,
      captionDeck: [],
      lastUpdated: null
    },
    {
      id: '2',
      hasStarted: false,
      hostPhotoURL: '/foo2.jpg',
      beginDate: null,
      safeForWork: true,
      hostId: 'abc2',
      isVotingRound: false,
      tagOptions: [],
      gifOptionURLs: [],
      maxPlayers: 8,
      pointsToWin: 5,
      captionDeck: [],
      lastUpdated: null
    },
    {
      id: '3',
      hasStarted: false,
      hostPhotoURL: '/foo3.jpg',
      beginDate: null,
      safeForWork: true,
      hostId: 'abc3',
      isVotingRound: false,
      tagOptions: [],
      gifOptionURLs: [],
      maxPlayers: 8,
      pointsToWin: 5,
      captionDeck: [],
      lastUpdated: null
    }
  ];
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let gameService: jasmine.SpyObj<GameService>;
  let router: jasmine.SpyObj<Router>;
  let settingsService;

  beforeEach(async(() => {
    // Auth Service
    userService = jasmine.createSpyObj('UserService', ['getPlayer', 'logout']);
    userService.getPlayer.and.returnValue({
      uid: '123',
      username: 'Jackie Treehorn',
      isActive: true,
      score: 0
    });
    userService.logout.and.returnValue(Promise.resolve());

    // Game Service
    gameService = jasmine.createSpyObj('GameService', ['getOpenGameList', 'createNewGame']);
    gameService.createNewGame.and.returnValue(Promise.resolve('some-game-id'));
    gameService.getOpenGameList.and.returnValue(of(GAMES));

    // Router
    router = jasmine.createSpyObj('Router', ['navigate']);

    // Settings Service
    settingsService = {
      safeForWork: false,
      setSafeForWorkMode(val) {
        this.safeForWork = val;
      }
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MomentModule],
      declarations: [ HomeComponent, FromFBDatePipe, GameSetupComponent  ],
      providers: [
        {
          provide: UserService,
          useValue: userService
        },
        {
          provide: GameService,
          useValue: gameService
        },
        {
          provide: Router,
          useValue: router
        },
        {
          provide: SettingsService,
          useValue: settingsService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should launch setup wizard when selecting `Host New Game`', () => {
    let wizard = fixture.nativeElement.querySelector('#game-setup');
    expect(wizard).toBeFalsy();

    const hostBtn = fixture.debugElement.query(By.css('.host-game'));
    hostBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    wizard = fixture.nativeElement.querySelector('#game-setup');
    expect(wizard).toBeDefined();
  });

  it('should take player to new game after creating', fakeAsync(() => {
    const hostBtn = fixture.debugElement.query(By.css('.host-game'));
    hostBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    const wizardEl = fixture.debugElement.query(By.directive(GameSetupComponent));
    const wizardComponent: GameSetupComponent = wizardEl.componentInstance;

    wizardComponent.createGame();

    tick();

    expect(router.navigate).toHaveBeenCalledWith(['game/some-game-id']);
  }));

  it('should get list of games when user clicks button', fakeAsync(() => {
    const findGamesBtn = fixture.debugElement.query(By.css('.find-game'));
    findGamesBtn.triggerEventHandler('click', null);

    tick();

    expect(component.games.length).toBe(3);
  }));

  it('should re-check game list when sfw selection changes', () => {
    component.sfw = true;
    component.sfwModeChanged();

    expect(component.sfwFilter$.value).toBe(true);

    component.sfw = false;
    component.sfwModeChanged();

    expect(component.sfwFilter$.value).toBe(false);
  });

  it('should redirect to login page when user logs out', fakeAsync(() => {
    component.logout();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should find and join game', () => {
    component.showOpenGames = true;
    component.games = GAMES;
    fixture.detectChanges();
    const gameToJoin = component.games[0];

    const gameListingEl = fixture.debugElement.query(By.css('.game-listing'));
    const joinBtn = gameListingEl.query(By.css('button'));
    joinBtn.triggerEventHandler('click', null);

    expect(router.navigate).toHaveBeenCalledWith([`game/${gameToJoin.id}`]);
  });
});
