import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CategoryManagerComponent } from './category-manager.component';
import { CategoryService } from '../../../game/services';
import { ClarityModule } from '@clr/angular';
import { CategoryAddComponent } from '../category-add/category-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../../../interfaces';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CategoryManagerComponent', () => {
  let component: CategoryManagerComponent;
  let fixture: ComponentFixture<CategoryManagerComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  const cats: () => Category[] = () => ([
    { id: '1', safeForWork: true, description: 'CCR' },
    { id: '2', safeForWork: false, description: 'LOG JAMMIN' },
    { id: '3', safeForWork: false, description: 'NIHILISM' }
  ]);

  // const categoryServiceFake = {
  //   getAll: () => Promise.resolve(cats()),
  //   delete: () => Promise.resolve(),
  //   add: (cat) => Promise.resolve({ id: '4', ...cat })
  // };
  // let deleteSpy;
  // let addSpy;

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj<CategoryService>('CategoryService', ['getAll', 'add', 'delete']);
    spy.getAll.and.returnValue(Promise.resolve(cats()));
    spy.add.and.callFake((cat) => Promise.resolve({ id: '4', ...cat }));
    spy.delete.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [ClarityModule, ReactiveFormsModule, NoopAnimationsModule],
      declarations: [CategoryManagerComponent, CategoryAddComponent],
      providers: [
        {
          provide: CategoryService, useValue: spy
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryManagerComponent);
    categoryServiceSpy = TestBed.get(CategoryService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.categories = cats();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show list of categories', () => {
    const categories = cats();
    component.categories = categories;
    fixture.detectChanges();
    const listingElements = fixture.debugElement.queryAll(By.css('.description'));
    expect(listingElements.length).toBe(cats().length);
    expect(listingElements[0].nativeElement.textContent).toBe(categories[0].description);
    expect(listingElements[1].nativeElement.textContent).toBe(categories[1].description);
    expect(listingElements[2].nativeElement.textContent).toBe(categories[2].description);
  });

  it('should save a new category and add it to the list', fakeAsync(() => {
    component.showNewCategoryForm();
    fixture.detectChanges();
    const newFormEl = fixture.debugElement.query(By.directive(CategoryAddComponent));
    const categoryAddComponent: CategoryAddComponent = newFormEl.componentInstance;
    const inputEl = newFormEl.query(By.css('input')).nativeElement;
    inputEl.value = 'NEW CATEGORY';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    categoryAddComponent.onSave();
    tick();

    expect(categoryServiceSpy.add).toHaveBeenCalled();
    expect(component.categories.length).toBe(4);
  }));

  it('should confirm category deletion', () => {
    const categoryToDelete = component.categories[0];
    component.stageCategoryForDelete(categoryToDelete);
    fixture.detectChanges();
    const deleteConfirmModal = fixture.debugElement.query(By.css('.modal-body'));
    const message = deleteConfirmModal.query(By.css('span'));

    expect(message.nativeElement.textContent).toBe(categoryToDelete.description);
  });

  it('should cancel a category addition', () => {
    component.showNewCategoryForm();
    fixture.detectChanges();
    let addFormEl = fixture.debugElement.query(By.directive(CategoryAddComponent));
    const categoryAddComponent: CategoryAddComponent = addFormEl.componentInstance;

    expect(addFormEl).toBeDefined();

    categoryAddComponent.onCancel();
    fixture.detectChanges();

    addFormEl = fixture.debugElement.query(By.directive(CategoryAddComponent));

    expect(addFormEl).toBeFalsy();
  });

  it('should cancel a cetegory deletion if nothing to delete', () => {
    component.categoryStagedForDelete = null;
    component.delete();

    expect(categoryServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should delete a category', fakeAsync(() => {
    const categoryToDelete = component.categories[0];
    component.stageCategoryForDelete(categoryToDelete);
    fixture.detectChanges();
    const deleteBtn = fixture.debugElement.query(By.css('.btn-danger'));
    deleteBtn.triggerEventHandler('click', null);
    tick();
    expect(component.categories).not.toContain(categoryToDelete);
  }));
});
