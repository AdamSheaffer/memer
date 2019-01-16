import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, filter, distinctUntilChanged, switchMap, combineLatest } from 'rxjs/operators';
import { GiphyService } from '../../../services';

@Component({
  selector: 'memer-giphy-search',
  templateUrl: './giphy-search.component.html',
  styleUrls: ['./giphy-search.component.scss']
})
export class GiphySearchComponent implements OnInit {
  searchText$ = new BehaviorSubject<string>('');
  page$ = new BehaviorSubject<number>(1);
  searchResults$: Observable<{ thumbnail: string, img: string }>;
  @Output() gifSelected = new EventEmitter<string>();

  constructor(private giphyService: GiphyService) { }

  ngOnInit() {
    this.searchResults$ = this.searchText$.pipe(
      combineLatest(this.page$),
      debounceTime(400),
      filter(([text, _page]) => text.length > 2),
      distinctUntilChanged(),
      switchMap(([text, page]) => {
        return this.giphyService.getPage(text, page);
      })
    );
  }

  nextPage() {
    const page = this.page$.value + 1;
    this.page$.next(page);
  }

  select(img: string) {
    this.gifSelected.emit(img);
  }

}
