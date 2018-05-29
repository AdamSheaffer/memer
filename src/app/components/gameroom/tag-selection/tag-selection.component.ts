import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'memer-tag-selection',
  templateUrl: './tag-selection.component.html',
  styleUrls: ['./tag-selection.component.scss']
})
export class TagSelectionComponent implements OnInit {
  @Input() tags: string[];
  @Input() playerCanSelect: boolean;
  @Output() tagSelect = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  selectTag(tag: string) {
    if (!this.playerCanSelect) { return; }
    this.tagSelect.emit(tag);
  }
}
