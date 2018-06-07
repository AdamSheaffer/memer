import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICard } from '../../../../interfaces';

@Component({
  selector: 'memer-caption-edit',
  templateUrl: './caption-edit.component.html',
  styleUrls: ['./caption-edit.component.scss']
})
export class CaptionEditComponent implements OnInit {
  @Input() caption: ICard;
  @Output() save = new EventEmitter<ICard>();
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      top: [this.caption.top, Validators.maxLength(40)],
      bottom: [this.caption.bottom, Validators.compose([
        Validators.required,
        Validators.maxLength(60)
      ])]
    });
  }

  onSave() {
    const { top, bottom } = this.form.getRawValue();
    this.save.emit({
      id: this.caption.id,
      createdBy: this.caption.createdBy,
      top,
      bottom
    });
  }
}
