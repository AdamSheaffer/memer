import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'memer-gif-options',
  templateUrl: './gif-options.component.html',
  styleUrls: ['./gif-options.component.scss']
})
export class GifOptionsComponent implements OnInit {
  @Input() displayGif: string;
  @Input() optionCount: number;
  @Input() playerCanSelect: boolean;
  @Output() onOptionChange = new EventEmitter<number>();
  @Output() onOptionSelect = new EventEmitter<string>();

  public imageIndex: number = 0;

  constructor() {
  }

  ngOnInit() {
  }

  next(): void {
    if (!this.playerCanSelect) return;
    this.imageIndex += 1
    if (this.imageIndex >= this.optionCount) this.imageIndex = 0;
    this.onOptionChange.emit(this.imageIndex);
  }

  previous(): void {
    if (!this.playerCanSelect) return;
    this.imageIndex -= 1
    if (this.imageIndex < 0) this.imageIndex = (this.optionCount - 1);
    this.onOptionChange.emit(this.imageIndex);
  }

  selectOption() {
    if (!this.playerCanSelect) return;
    this.onOptionSelect.emit(this.displayGif);
  }
}
