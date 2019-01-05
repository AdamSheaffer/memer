import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSelectionComponent } from './tag-selection.component';

describe('TagSelectionComponent', () => {
  let component: TagSelectionComponent;
  let fixture: ComponentFixture<TagSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit if it is not players turn', () => {
    spyOn(component.tagSelect, 'emit');

    component.playerCanSelect = false;
    component.selectTag('tag');

    expect(component.tagSelect.emit).not.toHaveBeenCalled();
  });

  it('should emit if it is players turn', () => {
    spyOn(component.tagSelect, 'emit');

    component.playerCanSelect = true;
    component.selectTag('tag');

    expect(component.tagSelect.emit).toHaveBeenCalled();
  });
});
