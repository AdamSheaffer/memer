import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptionAddComponent } from './caption-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

describe('CaptionAddComponent', () => {
  let component: CaptionAddComponent;
  let fixture: ComponentFixture<CaptionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, ClarityModule ],
      declarations: [ CaptionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
