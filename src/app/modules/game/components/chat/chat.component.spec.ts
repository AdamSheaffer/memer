import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { of } from 'rxjs';
import { ChatService } from '../../services';
import { AuthService } from '../../../core/services';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  const chatService = {
    gameId: '123',
    init: () => {},
    messages$: of([])
  };

  const authService = jasmine.createSpyObj('AuthService', ['getPlayer']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatComponent ],
      providers: [
        {
          provide: ChatService,
          useValue: chatService
        },
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
