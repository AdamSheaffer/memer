import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'memer-gif-options',
  templateUrl: './gif-options.component.html',
  styleUrls: ['./gif-options.component.scss']
})
export class GifOptionsComponent implements OnInit, OnDestroy {
  @Input() displayGif: string;
  @Input() optionCount: number;
  @Input() playerCanSelect: boolean;
  @Input() usernameSelecting: string;
  @Input() chosenTag: string;
  @Output() onOptionChange = new EventEmitter<number>();
  @Output() onOptionSelect = new EventEmitter<string>();

  public imageIndex: number = 0;
  public selectingIndicator = 'SELECTING   ';
  public timerId;

  constructor() {
  }

  ngOnInit() {
    this.timerId = setInterval(() => {
      if (this.selectingIndicator.includes("...")) {
        this.selectingIndicator = 'SELECTING   ';
      } else {
        this.selectingIndicator = this.selectingIndicator.replace(' ', '.');
      }
    }, 1000);
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

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }
}
