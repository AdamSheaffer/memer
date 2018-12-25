import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryManagerComponent } from './category-manager.component';
import { CategoryService } from '../../../game/services';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {  } from '@angular/compiler/src/core';

describe('CategoryManagerComponent', () => {
  let component: CategoryManagerComponent;
  let fixture: ComponentFixture<CategoryManagerComponent>;
  const categoryService = jasmine.createSpyObj('CategoryService', ['getAll']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [ CategoryManagerComponent ],
      providers: [
        {
          provide: CategoryService, useValue: categoryService
        }
      ]
    })
    .compileComponents();

    categoryService.getAll.and.returnValue(Promise.resolve([]));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
