import { Component, OnInit } from '@angular/core';
import { CaptionService } from '../../services/caption.service';
import { Observable } from 'rxjs';
import { ICard } from '../../../../interfaces';
import { ClrDatagridStringFilterInterface } from '@clr/angular';


@Component({
  selector: 'memer-deck-manager',
  templateUrl: './deck-manager.component.html',
  styleUrls: ['./deck-manager.component.scss']
})
export class DeckManagerComponent implements OnInit {
  captions$: Observable<ICard[]>;
  captions: ICard[];
  topFilter = new TopFilter();

  constructor(private captionService: CaptionService) {
    this.captions$ = captionService.captions$;
    this.captions$.subscribe(c => this.captions = c);
  }

  ngOnInit() {
  }
}

class TopFilter implements ClrDatagridStringFilterInterface<string> {
  accepts(captionTop: string, search: string) {
    return captionTop.toLowerCase().includes(search.toLowerCase());
  }
}
