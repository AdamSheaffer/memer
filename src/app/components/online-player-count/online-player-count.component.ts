import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'memer-online-player-count',
  templateUrl: './online-player-count.component.html',
  styleUrls: ['./online-player-count.component.scss']
})
export class OnlinePlayerCountComponent implements OnInit {
  onlineCount$: Observable<number>;

  constructor(private afdb: AngularFireDatabase) { }

  ngOnInit() {
    this.onlineCount$ = this.afdb.object<number>('playersOnline').valueChanges();
  }

}
