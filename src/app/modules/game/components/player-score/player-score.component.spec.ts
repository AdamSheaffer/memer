import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerScoreComponent } from './player-score.component';
import { ClarityModule } from '@clr/angular';

describe('PlayerScoreComponent', () => {
  let component: PlayerScoreComponent;
  let fixture: ComponentFixture<PlayerScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule],
      declarations: [ PlayerScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerScoreComponent);
    component = fixture.componentInstance;
    component.player = {
      username: 'Lebowski',
      uid: '123',
      fullName: 'Jeff Lebowski',
      photoURL: 'foo.jpg',
      thumbnailURL: 'tinyfoo.jpg',
      isActive: true,
      score: 3,
      roles: { player: true }
    };
    component.pointsToWin = 10;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
