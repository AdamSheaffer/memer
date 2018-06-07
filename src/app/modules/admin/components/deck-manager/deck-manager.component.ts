import { Component, OnInit } from '@angular/core';
import { CaptionService } from '../../services/caption.service';
import { Observable } from 'rxjs';
import { Card } from '../../../../interfaces';
import { ClrDatagridStringFilterInterface } from '@clr/angular';


@Component({
  selector: 'memer-deck-manager',
  templateUrl: './deck-manager.component.html',
  styleUrls: ['./deck-manager.component.scss']
})
export class DeckManagerComponent implements OnInit {
  captions$: Observable<Card[]>;
  captions: Card[];
  expandedCaption: string;

  constructor(private captionService: CaptionService) {
    this.captions$ = captionService.captions$;
    this.captions$.subscribe(c => this.captions = c);
  }

  ngOnInit() {
  }

  update(caption: Card) {
    this.captionService.update(caption).then(() => {
      this.expandedCaption = null;
    });
  }
}
