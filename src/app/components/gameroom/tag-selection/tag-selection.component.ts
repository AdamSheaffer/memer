import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'memer-tag-selection',
  templateUrl: './tag-selection.component.html',
  styleUrls: ['./tag-selection.component.scss']
})
export class TagSelectionComponent implements OnInit {
  @Input() tags: string[];
  @Output() onTagSelect = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  selectTag(tag: string) {
    this.onTagSelect.emit(tag);
  }
}
