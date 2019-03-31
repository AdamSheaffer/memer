import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Card, Meme } from '../../../../interfaces';
import * as firebase from 'firebase/app';
import moment from 'moment';
import sample from 'lodash/sample';
import { ThemeService, Theme } from '../../../core/services';
import { GiphyService, WebworkerService } from '../../services';
import { Subject } from 'rxjs';

declare function postMessage(message: any): void;

@Component({
  selector: 'memer-round-timer',
  templateUrl: './round-timer.component.html',
  styleUrls: ['./round-timer.component.scss']
})
export class RoundTimerComponent implements OnInit, OnDestroy {
  timer: number;
  timer$: Subject<number>;
  intervalId: any;

  @Output() timerComplete = new EventEmitter<Card>();
  @Output() reverseTimerComplete = new EventEmitter<string>();
  @Input() cards: Card[];
  @Input() templateTimestamp: firebase.firestore.Timestamp;
  @Input() limit: number;
  @Input() reverseRound: boolean;
  @Input()
  set memeTemplate (template: Meme) {
    if (!template) { return; }
    if (this.timestampDiff() > this.limit) { return; }

    const timeLeft = this.limit - this.timestampDiff();
    this.startTimer(timeLeft);
  }

  get isDarkTheme() { return this.themeService.theme === Theme.DARK; }

  constructor(
    private themeService: ThemeService,
    private giphyService: GiphyService,
    private webWorkerService: WebworkerService) { }

  ngOnInit() {
  }

  private timestampDiff(): number {
    const timestamp = moment(this.templateTimestamp.toDate());
    const now = moment();
    const diff = Math.abs(now.diff(timestamp, 'seconds'));
    return diff;
  }

  private countdown(timeLeft: number) {
    let remaining = timeLeft;
    const intervalId = setInterval(() => {
      remaining -= 1;
      postMessage(remaining);
      if (remaining < 0) {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  private startTimer(timeLeft: number) {
    this.timer = timeLeft;
    this.timer$ = this.webWorkerService.run<number>(this.countdown, this.timer);
    this.timer$.subscribe(remaining => {
        if (remaining < 0) {
          this.notify();
          this.webWorkerService.terminate(this.timer$);
        }
        this.timer = remaining;
      });
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
    this.webWorkerService.terminate(this.timer$);
  }
}
