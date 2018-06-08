import { Component, OnInit } from '@angular/core';
import { CaptionService } from '../../services/caption.service';
import { Observable } from 'rxjs';
import { Card } from '../../../../interfaces';
import { AuthService } from '../../../core/services';


@Component({
  selector: 'memer-deck-manager',
  templateUrl: './deck-manager.component.html',
  styleUrls: ['./deck-manager.component.scss']
})
export class DeckManagerComponent implements OnInit {
  captions$: Observable<Card[]>;
  captions: Card[];
  expandedCaption: string;
  showingNewCardForm = false;

  constructor(private captionService: CaptionService, private authService: AuthService) {
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

  add(caption: Card) {
    const user = this.authService.getPlayer();
    caption.createdBy = user.username;
    this.captionService.add(caption).then(() => {
      this.showingNewCardForm = false;
    });
  }

  delete(caption: Card) {
    this.captionService.delete(caption);
  }

  showAddForm(showing: boolean) {
    this.showingNewCardForm = showing;
  }
}
