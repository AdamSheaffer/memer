import { Component, OnInit, Input, Renderer, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Card } from '../../../../interfaces';

@Component({
  selector: 'memer-meme',
  templateUrl: './meme.component.html',
  styleUrls: ['./meme.component.scss']
})
export class MemeComponent implements AfterViewInit {
  @Input() caption: Card = { top: null, bottom: '????' };
  @Input() imageURL: string;
  @ViewChild('meme', { read: ElementRef }) meme: ElementRef;
  @ViewChild('memetop', { read: ElementRef }) topCaption: ElementRef;
  @ViewChild('memeimg', { read: ElementRef }) img: ElementRef;
  @ViewChild('memebottom', { read: ElementRef }) bottomCaption: ElementRef;

  private maxFontSize = 62;
  private maxHeight = 80;

  constructor(private renderer: Renderer) {

  }

  ngAfterViewInit(): void {
    if (!this.topCaption || !this.bottomCaption) { return; }

    const imgWidth = this.getElementWidth(this.img);

    this.renderer.setElementStyle(this.topCaption.nativeElement, 'width', `${imgWidth}px`);
    this.renderer.setElementStyle(this.bottomCaption.nativeElement, 'width', `${imgWidth}px`);

    const topHeight = this.getElementHeight(this.topCaption);
    const bottomHeight = this.getElementHeight(this.bottomCaption);

    if (topHeight > this.maxHeight) {
      this.scaleDownFont(this.topCaption);
    }

    if (bottomHeight > this.maxHeight) {
      this.scaleDownFont(this.bottomCaption);
    }

  }

  private scaleDownFont(captionRef: ElementRef) {
    let fontSize = this.maxFontSize;
    this.renderer.setElementStyle(captionRef.nativeElement, 'font-size', `${fontSize}px`);

    while (this.getElementHeight(captionRef) > this.maxHeight) {
      fontSize -= 4;
      this.renderer.setElementStyle(captionRef.nativeElement, 'font-size', `${fontSize}px`);
    }
  }

  private getElementWidth(elRef: ElementRef) {
    if (!elRef) { return; }

    return elRef.nativeElement.offsetWidth;
  }

  private getElementHeight(elRef: ElementRef) {
    if (!elRef) { return; }

    return elRef.nativeElement.offsetHeight;
  }
}
