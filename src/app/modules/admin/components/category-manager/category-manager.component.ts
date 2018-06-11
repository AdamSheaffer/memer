import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../game/services';
import { Category } from '../../../../interfaces';

@Component({
  selector: 'memer-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss']
})
export class CategoryManagerComponent implements OnInit {
  categories: Category[];
  categoryStagedForDelete: Category;
  showingNewCategoryForm = false;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().then(categories => {
      this.categories = categories;
    });
  }

  save(category: Category) {
    this.categoryService.add(category).then(newCategory => {
      this.categories.unshift(newCategory);
      this.showingNewCategoryForm = false;
    });
  }

  cancel() {
    this.showingNewCategoryForm = false;
  }

  stageCategoryForDelete(category: Category) {
    this.categoryStagedForDelete = category;
  }

  delete() {
    const category = this.categoryStagedForDelete;
    if (!category) { return; }

    this.categoryService.delete(this.categoryStagedForDelete).then(() => {
      const index = this.categories.findIndex(c => c.id === category.id);
      this.categories.splice(index, 1);
      this.categoryStagedForDelete = null;
    });
  }

  showNewCategoryForm() {
    this.showingNewCategoryForm = true;
  }
}
