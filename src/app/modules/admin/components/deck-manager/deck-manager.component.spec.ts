import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckManagerComponent } from './deck-manager.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CaptionService } from '../../services/caption.service';
import { AuthService } from '../../../core/services';

describe('DeckManagerComponent', () => {
  let component: DeckManagerComponent;
  let fixture: ComponentFixture<DeckManagerComponent>;
  const captionService = jasmine.createSpyObj('CaptionService', ['getAll']);
  const authService = jasmine.createSpyObj('AuthService', ['getPlayer']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ClarityModule],
      declarations: [ DeckManagerComponent ],
      providers: [
        {
          provide: CaptionService,
          useValue: captionService
        },
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    })
    .compileComponents();

    captionService.getAll.and.returnValue(Promise.resolve([]));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
