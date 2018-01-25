import { Component, OnInit, Input } from '@angular/core';
import { ICard } from '../../interfaces/ICard';

@Component({
  selector: 'memer-meme',
  templateUrl: './meme.component.html',
  styleUrls: ['./meme.component.scss']
})
export class MemeComponent implements OnInit {
  @Input() caption: ICard = { top: '????', bottom: null };
  @Input() imageURL: string;

  constructor() {

  }

  ngOnInit() {
  }

}
