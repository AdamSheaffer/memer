import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, filter, distinctUntilChanged, switchMap, combineLatest, tap } from 'rxjs/operators';
import { GiphyService } from '../../../services';
import { ThemeService, Theme } from '../../../../core/services';

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
  get isDarkTheme() { return this.themeService.theme === Theme.DARK; }

  constructor(private giphyService: GiphyService, private themeService: ThemeService) { }

  ngOnInit() {
    this.searchResults$ = this.searchText$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      filter(text => text.length > 2),
      tap(_t => this.page$.next(1)),
      combineLatest(this.page$),
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
