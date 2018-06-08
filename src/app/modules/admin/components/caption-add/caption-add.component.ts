import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Card } from '../../../../interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'memer-caption-add',
  templateUrl: './caption-add.component.html',
  styleUrls: ['./caption-add.component.scss']
})
export class CaptionAddComponent implements OnInit {
  @Output() save = new EventEmitter<Card>();
  @Output() cancel = new EventEmitter<void>();
  form: FormGroup;
  card: Card = { top: null, bottom: null, safeForWork: false };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      top: [this.card.top, Validators.maxLength(40)],
      bottom: [this.card.bottom, Validators.compose([
        Validators.required,
        Validators.maxLength(60)
      ])],
      safeForWork: [this.card.safeForWork]
    });
  }

  onSave() {
    const { top, bottom, safeForWork } = this.form.getRawValue();
    this.card.top = top;
    this.card.bottom = bottom;
    this.card.safeForWork = safeForWork;
    this.save.emit(this.card);
  }

  onCancel() {
    this.cancel.emit();
  }

}
