import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PlayerHandComponent } from './player-hand.component';
import { Renderer2 } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Card } from '../../../../../interfaces';
import { Theme, ThemeService } from '../../../../core/services';

describe('PlayerHandComponent', () => {
  let component: PlayerHandComponent;
  let fixture: ComponentFixture<PlayerHandComponent>;
  let themeService;

  beforeEach(async(() => {
    themeService = { theme: Theme.LIGHT };

    TestBed.configureTestingModule({
      declarations: [PlayerHandComponent],
      providers: [
        Renderer2,
        {
          provide: ThemeService,
          useValue: themeService
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selectCard should not do anything if it is not submission time', () => {
    spyOn(component.cardSelect, 'emit');
    component.playerCanSelect = false;
    component.selectCard(null, null);

    expect(component.cardSelect.emit).not.toHaveBeenCalled();
  });

  it('selectCard should emit event after selecting', fakeAsync(() => {
    spyOn(component.cardSelect, 'emit');
    component.playerHand = [
      { id: 'card-id 1' } as Card
    ];
    component.playerCanSelect = true;
    fixture.detectChanges();
    const cardEl = fixture.debugElement.query(By.css('.card'));
    const card = component.playerHand[0];
    cardEl.triggerEventHandler('click', card);
    cardEl.nativeElement.dispatchEvent(new Event('animationend'));
    tick();

    expect(component.cardSelect.emit).toHaveBeenCalledWith(card);
  }));

  it('selectCard should emit event after selecting (webkit)', fakeAsync(() => {
    spyOn(component.cardSelect, 'emit');
    component.playerHand = [
      { id: 'card-id 1' } as Card
    ];
    component.playerCanSelect = true;
    fixture.detectChanges();
    const cardEl = fixture.debugElement.query(By.css('.card'));
    const card = component.playerHand[0];
    cardEl.triggerEventHandler('click', card);
    cardEl.nativeElement.dispatchEvent(new Event('webkitAnimationEnd'));
    tick();

    expect(component.cardSelect.emit).toHaveBeenCalledWith(card);
  }));
});
