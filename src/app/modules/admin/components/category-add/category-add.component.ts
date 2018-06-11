import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Category } from '../../../../interfaces';

@Component({
  selector: 'memer-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnInit {
  @Output() save = new EventEmitter<Category>();
  @Output() cancel = new EventEmitter<void>();
  form: FormGroup;
  category: Category = { description: null };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      description: [this.category.description, Validators.compose([
        Validators.required,
        Validators.maxLength(20)
      ])]
    });
  }

  onSave() {
    const description = this.form.get('description').value;
    this.category.description = description;
    this.save.emit(this.category);
  }

  onCancel() {
    this.cancel.emit();
  }

}
