import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptionEditComponent } from './caption-edit.component';

describe('CaptionEditComponent', () => {
  let component: CaptionEditComponent;
  let fixture: ComponentFixture<CaptionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
