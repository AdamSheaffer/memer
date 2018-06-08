import { Component, OnInit, OnDestroy } from '@angular/core';
import { CaptionService } from '../../services/caption.service';
import { Observable, Subject } from 'rxjs';
import { Card } from '../../../../interfaces';
import { AuthService } from '../../../core/services';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'memer-deck-manager',
  templateUrl: './deck-manager.component.html',
  styleUrls: ['./deck-manager.component.scss']
})
export class DeckManagerComponent implements OnInit, OnDestroy {
  captions$: Observable<Card[]>;
  captions: Card[];
  expandedCaption: string;
  showingNewCardForm = false;
  destroy$ = new Subject<boolean>();

  constructor(private captionService: CaptionService, private authService: AuthService) {
    this.captions$ = captionService.captions$;
    this.captions$.pipe(takeUntil(this.destroy$))
      .subscribe(c => this.captions = c);
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
