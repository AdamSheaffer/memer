import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'memer-gif-options',
  templateUrl: './gif-options.component.html',
  styleUrls: ['./gif-options.component.scss']
})
export class GifOptionsComponent implements OnInit {
  @Input() optionUrls: string;
  @Input() playerCanSelect: boolean;
  @Output() onOptionSelect = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  selectOption(url: string) {
    if (!this.playerCanSelect) return;
    this.onOptionSelect.emit(url);
  }
}
