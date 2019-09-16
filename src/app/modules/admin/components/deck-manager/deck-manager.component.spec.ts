import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CaptionAddComponent, CaptionEditComponent, DeckManagerComponent } from '../';
import { ClarityModule, ClrDatagridRowDetail, ClrDatagridRow } from '@clr/angular';
import { CaptionService } from '../../services/caption.service';
import { UserService } from '../../../core/services';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DeckManagerComponent', () => {
  let component: DeckManagerComponent;
  let fixture: ComponentFixture<DeckManagerComponent>;
  const captionService = jasmine.createSpyObj('CaptionService', ['getAll', 'add', 'update', 'delete']);
  const userService = jasmine.createSpyObj('UserService', ['getPlayer']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule, ReactiveFormsModule, NoopAnimationsModule],
      declarations: [DeckManagerComponent, CaptionAddComponent, CaptionEditComponent],
      providers: [
        {
          provide: CaptionService,
          useValue: captionService
        },
        {
          provide: UserService,
          useValue: userService
        }
      ]
    })
      .compileComponents();

    captionService.getAll.and.returnValue(Promise.resolve([
      { id: '1', top: 'CARD TOP 1', bottom: 'CARD BOTTOM 1' },
      { id: '2', top: 'CARD TOP 2', bottom: 'CARD BOTTOM 2' },
      { id: '3', top: 'CARD TOP 2', bottom: 'CARD BOTTOM 3' },
    ]));

    captionService.add.and.callFake(caption => {
      return Promise.resolve({ id: `4`, ...caption });
    });

    captionService.update.and.returnValue(Promise.resolve());
    captionService.delete.and.returnValue(Promise.resolve());

    userService.getPlayer.and.returnValue({ username: 'The Dude' });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide and show the add form', () => {
    let addFormEl = fixture.debugElement.query(By.directive(CaptionAddComponent));
    expect(addFormEl).toBeFalsy();

    component.showAddForm(true);
    fixture.detectChanges();

    addFormEl = fixture.debugElement.query(By.directive(CaptionAddComponent));
    expect(addFormEl).toBeDefined();
  });

  it('should add a caption', fakeAsync(() => {
    component.ngOnInit();
    tick();
    component.showAddForm(true);
    fixture.detectChanges();
    const addFormEl = fixture.debugElement.query(By.directive(CaptionAddComponent));
    const captionAddComponent: CaptionAddComponent = addFormEl.componentInstance;

    const topInput = addFormEl.query(By.css('#top')).nativeElement;
    const bottomInput = addFormEl.query(By.css('#bottom')).nativeElement;
    topInput.value = 'TFW';
    topInput.dispatchEvent(new Event('input'));
    bottomInput.value = 'YOU ADD A NEW CARD';
    bottomInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    captionAddComponent.onSave();
    tick();

    expect(captionService.add).toHaveBeenCalled();
    expect(component.captions.length).toBe(4);
  }));

  it('should cancel add and hide form', () => {
    component.showAddForm(true);
    fixture.detectChanges();
    let addFormEl = fixture.debugElement.query(By.directive(CaptionAddComponent));
    const captionAddComponent: CaptionAddComponent = addFormEl.componentInstance;

    captionAddComponent.onCancel();
    fixture.detectChanges();

    addFormEl = fixture.debugElement.query(By.directive(CaptionAddComponent));

    expect(addFormEl).toBeFalsy();
  });

  it('should edit a caption and update list', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    const rowEl = fixture.debugElement.query(By.directive(ClrDatagridRow));
    const rowComponent: ClrDatagridRow = rowEl.componentInstance;
    rowComponent.expand.expanded = true;
    rowComponent.toggle();
    fixture.detectChanges();
    const formEl = rowEl.query(By.directive(CaptionEditComponent));
    const bottomInput = formEl.query(By.css('#bottom')).nativeElement;
    bottomInput.value = 'UPDATED';
    bottomInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const formComponent = formEl.componentInstance;
    formComponent.onSave();
    tick();

    expect(component.captions[0].bottom).toBe('UPDATED');
  }));

  it('should delete a caption', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    const rowEl = fixture.debugElement.query(By.directive(ClrDatagridRow));
    const rowComponent: ClrDatagridRow = rowEl.componentInstance;
    rowComponent.expand.expanded = true;
    rowComponent.toggle();
    fixture.detectChanges();
    const editComponent: CaptionEditComponent = rowEl.query(By.directive(CaptionEditComponent)).componentInstance;
    editComponent.stageDelete();
    editComponent.onDelete();
    tick();

    expect(component.captions.length).toBe(2);

    const caption1 = component.captions.find(c => c.id === '1');
    expect(caption1).toBeUndefined();
  }));
});
