import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameroomComponent } from './gameroom.component';
import { ClarityModule } from '@clr/angular';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { ActivePlayersPipe, CurrentUserPipe, ShufflePipe } from '../../pipes';
import { AuthService, PlayerService, Theme, ThemeService, GameService } from '../../../core/services';
import { CategoryService, ChatService, DeckService, GiphyService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Game } from '../../../../interfaces';

describe('GameroomComponent', () => {
  let component: GameroomComponent;
  let fixture: ComponentFixture<GameroomComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let playerService: jasmine.SpyObj<PlayerService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let chatService: jasmine.SpyObj<ChatService>;
  let deckService: jasmine.SpyObj<DeckService>;
  let giphyService: jasmine.SpyObj<GiphyService>;
  let router: jasmine.SpyObj<Router>;
  let gameService: jasmine.SpyObj<GameService>;
  let themeService: any;
  let route: any;

  beforeEach(async(() => {
    // AuthService
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getPlayer']);
    authService.getPlayer.and.returnValue({ uid: '123abc', username: 'Jeff Lebowski' });

    // Player Service
    playerService = jasmine.createSpyObj<PlayerService>('PlayerService', ['init', 'join', 'getCurrentPlayersHand', 'update']);
    playerService.init.and.returnValue(of([{ uid: '123abc', username: 'Jeff Lebowksi' }]));
    playerService.join.and.returnValue(Promise.resolve('player123'));
    playerService.getCurrentPlayersHand.and.returnValue(of([]));

    // Category Service
    categoryService = jasmine.createSpyObj<CategoryService>('CategoryService', ['getNCategories']);

    // Chat Service
    chatService = jasmine.createSpyObj<ChatService>('ChatService', ['postAdminMessage']);

    // Deck Service
    deckService = jasmine.createSpyObj<DeckService>('DeckService', ['init']);

    // Giphy Service
    giphyService = jasmine.createSpyObj<GiphyService>('GiphyService', ['getRandomImages']);

    // Router
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    // Game Service
    gameService = jasmine.createSpyObj<GameService>('GameService', ['init', 'updateGame']);
    gameService.init.and.returnValue(of<Game>({
      maxPlayers: 5,
      pointsToWin: 7,
      safeForWork: false,
      hasStarted: false,
      beginDate: null,
      hostId: 'hostId',
      hostPhotoURL: 'host.png',
      tagOptions: [],
      gifOptionURLs: [],
      captionDeck: [],
      isVotingRound: false,
      lastUpdated: null
    }));

    // Theme Service
    themeService = { theme: Theme.LIGHT };

    // Activated Route
    route = {
      paramMap: of({
        get: () => 'gameABC'
      })
    };

    TestBed.configureTestingModule({
      imports: [ClarityModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        GameroomComponent,
        ActivePlayersPipe,
        CurrentUserPipe,
        ShufflePipe
      ],
      providers: [
        Renderer2,
        {
          provide: AuthService,
          useValue: authService
        },
        {
          provide: PlayerService,
          useValue: {}
        },
        {
          provide: CategoryService,
          useValue: categoryService
        },
        {
          provide: ChatService,
          useValue: chatService
        },
        {
          provide: DeckService,
          useValue: deckService
        },
        {
          provide: GiphyService,
          useValue: giphyService
        },
        {
          provide: Router,
          useValue: router
        },
        {
          provide: ActivatedRoute,
          useValue: route
        },
        {
          provide: ThemeService,
          useValue: themeService
        },
        {
          provide: GameService,
          useValue: gameService
        },
        {
          provide: PlayerService,
          useValue: playerService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
