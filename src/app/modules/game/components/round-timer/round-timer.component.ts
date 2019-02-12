import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Card, Meme } from '../../../../interfaces';
import * as firebase from 'firebase/app';
import moment from 'moment';
import sample from 'lodash/sample';
import { ThemeService, Theme } from '../../../core/services';
import { GiphyService } from '../../services';

@Component({
  selector: 'memer-round-timer',
  templateUrl: './round-timer.component.html',
  styleUrls: ['./round-timer.component.scss']
})
export class RoundTimerComponent implements OnInit, OnDestroy {
  timer: number;
  intervalId: any;

  @Output() timerComplete = new EventEmitter<Card>();
  @Output() reverseTimerComplete = new EventEmitter<string>();
  @Input() cards: Card[];
  @Input() templateTimestamp: firebase.firestore.Timestamp;
  @Input() limit: number;
  @Input() reverseRound: boolean;
  @Input()
  set memeTemplate (template: Meme) {
    if (!!template) {
      const timestamp = moment(this.templateTimestamp.toDate());
      const diff = Math.abs(timestamp.diff(moment(), 'seconds'));
      if (diff > this.limit) { return; }

      const timeLeft = this.limit - diff;
      this.startTimer(timeLeft);
    }
  }

  get isDarkTheme() { return this.themeService.theme === Theme.DARK; }

  constructor(private themeService: ThemeService, private giphyService: GiphyService) { }

  ngOnInit() {
  }

  private startTimer(timeLeft: number) {
    this.timer = timeLeft;
    this.intervalId = setInterval(() => {
      this.timer -= 1;
      if (this.timer < 0) {
        clearInterval(this.intervalId);
        this.notify();
      }
    }, 1000);
  }

  private notify() {
    if (this.reverseRound) {
      this.giphyService.getWildcard().then(res => {
        const url = res.data[0].images.fixed_height.url;
        this.reverseTimerComplete.emit(url);
      });
    } else {
      this.timerComplete.emit(sample(this.cards));
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
