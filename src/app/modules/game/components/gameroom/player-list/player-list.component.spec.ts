import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerListComponent } from './player-list.component';
import { Theme, ThemeService } from '../../../../core/services';
import { ActivePlayersPipe } from '../../../pipes';
import { ClarityModule } from '@clr/angular';
import { PlayerScoreComponent } from '../../player-score/player-score.component';

describe('PlayerListComponent', () => {
  let component: PlayerListComponent;
  let fixture: ComponentFixture<PlayerListComponent>;
  const themeService = { theme: Theme.LIGHT };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule],
      declarations: [ PlayerListComponent, ActivePlayersPipe, PlayerScoreComponent ],
      providers: [
        {
          provide: ThemeService,
          useValue: themeService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerListComponent);
    component = fixture.componentInstance;
    component.players = [];
    component.turn = 'player 1',
    component.isHost = false;
    component.hostId = 'player 2';
    component.pointsToWin = 10;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
