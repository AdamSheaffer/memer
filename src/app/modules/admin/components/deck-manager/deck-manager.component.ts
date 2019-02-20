import { Component, OnInit, OnDestroy } from '@angular/core';
import { CaptionService } from '../../services/caption.service';
import { Subject } from 'rxjs';
import { Card } from '../../../../interfaces';
import { UserService } from '../../../core/services';


@Component({
  selector: 'memer-deck-manager',
  templateUrl: './deck-manager.component.html',
  styleUrls: ['./deck-manager.component.scss']
})
export class DeckManagerComponent implements OnInit, OnDestroy {
  captions: Card[];
  showingNewCardForm = false;
  destroy$ = new Subject<boolean>();

  constructor(private captionService: CaptionService, private userService: UserService) {
  }

  ngOnInit() {
    this.captionService.getAll().then(captions => {
      this.captions = captions;
    });
  }

  update(caption: Card) {
    this.captionService.update(caption).then(() => {
      const index = this.captions.findIndex(c => c.id === caption.id);
      this.captions.splice(index, 1, caption);
    });
  }

  add(caption: Card) {
    const user = this.userService.getPlayer();
    caption.createdBy = user.username;
    this.captionService.add(caption).then((newCaption) => {
      this.captions.unshift(newCaption);
      this.showingNewCardForm = false;
    });
  }

  delete(caption: Card) {
    this.captionService.delete(caption).then(() => {
      const index = this.captions.findIndex(c => c.id === caption.id);
      this.captions.splice(index, 1);
    });
  }

  showAddForm(showing: boolean) {
    this.showingNewCardForm = showing;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
