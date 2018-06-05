import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckManagerComponent } from './deck-manager.component';

describe('DeckManagerComponent', () => {
  let component: DeckManagerComponent;
  let fixture: ComponentFixture<DeckManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckManagerComponent ]
    })
    .compileComponents();
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
