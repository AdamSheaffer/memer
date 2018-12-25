import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameroomComponent } from './gameroom.component';
import { ClarityModule } from '@clr/angular';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { ActivePlayersPipe, CurrentUserPipe, ShufflePipe } from '../../pipes';
import { AuthService, PlayerService, Theme, ThemeService, GameService } from '../../../core/services';
import { CategoryService, ChatService, DeckService, GiphyService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('GameroomComponent', () => {
  let component: GameroomComponent;
  let fixture: ComponentFixture<GameroomComponent>;
  const authService = jasmine.createSpyObj('AuthService', ['getPlayer']);
  authService.getPlayer.and.returnValue({});
  const playerService = jasmine.createSpyObj('PlayerService', ['init', 'join', 'getCurrentPlayersHand']);
  // playerService.join.and.returnValue(Promise.resolve('player123'));
  const categoryService = jasmine.createSpyObj('CategoryService', ['getNCategories']);
  const chatService = jasmine.createSpyObj('ChatService', ['postAdminMessage']);
  const deckService = jasmine.createSpyObj('DeckService', ['init']);
  const giphyService = jasmine.createSpyObj('GiphyService', ['getRandomImages']);
  const router = jasmine.createSpyObj('Router', ['navigate']);
  const gameService = jasmine.createSpyObj('GameService', ['init', 'updateGame']);
  const themeService = { theme: Theme.LIGHT };
  const route = {
    paramMap: of({
      params: { get: () => 'gameABC' }
    })
  };

  beforeEach(async(() => {
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
