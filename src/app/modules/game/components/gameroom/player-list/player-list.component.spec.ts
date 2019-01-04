import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerListComponent } from './player-list.component';
import { Theme, ThemeService } from '../../../../core/services';
import { ActivePlayersPipe } from '../../../pipes';
import { ClarityModule } from '@clr/angular';
import { PlayerScoreComponent } from '../../player-score/player-score.component';
import { Player } from '../../../../../interfaces';

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

  it('should prevent non-host players from removing other player', () => {
    const player: Player = {
      uid: '1',
      fullName: 'The Dude',
      username: 'The Dude',
      isActive: true,
      photoURL: null,
      roles: null,
      thumbnailURL: null,
      score: 0
    };
    component.isHost = false;
    component.stagePlayerToRemove(player);

    expect(component.playerStagedForRemoval).toBeFalsy();
  });

  it('should stage player for removal', () => {
    const player: Player = {
      uid: '1',
      fullName: 'The Dude',
      username: 'The Dude',
      isActive: true,
      photoURL: null,
      roles: null,
      thumbnailURL: null,
      score: 0
    };
    component.isHost = true;
    component.stagePlayerToRemove(player);

    expect(component.playerStagedForRemoval).toBe(player);
  });

  it('should prevent non-host players from emitting removal', () => {
    spyOn(component.playerRemoval, 'emit');
    const player: Player = {
      uid: '1',
      fullName: 'The Dude',
      username: 'The Dude',
      isActive: true,
      photoURL: null,
      roles: null,
      thumbnailURL: null,
      score: 0
    };
    component.isHost = false;
    component.playerStagedForRemoval = player;
    component.removePlayer();

    expect(component.playerRemoval.emit).not.toHaveBeenCalled();
  });

  it('should emit removal event', () => {
    spyOn(component.playerRemoval, 'emit');
    const player: Player = {
      uid: '1',
      fullName: 'The Dude',
      username: 'The Dude',
      isActive: true,
      photoURL: null,
      roles: null,
      thumbnailURL: null,
      score: 0
    };
    component.isHost = true;
    component.playerStagedForRemoval = player;
    component.removePlayer();

    expect(component.playerRemoval.emit).toHaveBeenCalledWith(player);
  });

  it('should compute theme', () => {
    expect(component.isDarkTheme).toBe(false);
  });
});
