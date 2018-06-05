import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GifOptionsComponent } from './gif-options.component';

describe('GifOptionsComponent', () => {
  let component: GifOptionsComponent;
  let fixture: ComponentFixture<GifOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GifOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GifOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
