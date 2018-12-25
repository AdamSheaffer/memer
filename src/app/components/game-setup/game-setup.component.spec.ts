import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSetupComponent } from './game-setup.component';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../modules/core/services';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GameSetupComponent', () => {
  let component: GameSetupComponent;
  let fixture: ComponentFixture<GameSetupComponent>;
  const gameService = jasmine.createSpyObj('GameService', ['createNewGame']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {
          provide: GameService,
          useValue: gameService
        }
      ],
      declarations: [ GameSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
