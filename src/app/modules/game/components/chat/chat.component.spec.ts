import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { of } from 'rxjs';
import { ChatService } from '../../services';
import { UserService } from '../../../core/services';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  const chatService = {
    gameId: '123',
    init: () => {},
    messages$: of([]),
    sendMessage: (_user, _message) => Promise.resolve()
  };

  const userService = jasmine.createSpyObj('UserService', ['getPlayer']);

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ ChatComponent ],
      providers: [
        {
          provide: ChatService,
          useValue: chatService
        },
        {
          provide: UserService,
          useValue: userService
        }
      ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(chatService, 'sendMessage');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset message after sending', fakeAsync(() => {
    component.currentUser = {
      uid: '1',
      username: 'The Dude',
      photoURL: null,
      roles: {},
      isActive: true,
      score: 4,
      thumbnailURL: null,
      fullName: 'Jeff Lebowski'
    };

    component.messageContent = 'Hello';
    component.send();
    tick();

    expect(component.messageContent).toBeFalsy();
  }));

  it('should should not send empty content', () => {
    component.currentUser = {
      uid: '1',
      username: 'The Dude',
      photoURL: null,
      roles: {},
      isActive: true,
      score: 4,
      thumbnailURL: null,
      fullName: 'Jeff Lebowski'
    };

    component.messageContent = '     ';
    component.send();
    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });
});
