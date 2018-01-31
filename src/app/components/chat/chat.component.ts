import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IGame } from '../../interfaces/IGame';
import { IMessage } from '../../interfaces/IMessage';
import { AuthService } from '../../services/auth.service';
import { IPlayer } from '../../interfaces/IPlayer';

@Component({
  selector: 'memer-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() messages: IMessage[];
  @Output() onMessageSend = new EventEmitter<IMessage>();
  currentUser: IPlayer;
  messageContent: string = null;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getUser();
  }

  ngOnInit() {
  }

  send() {
    debugger;
    if (!this.messageContent) return;

    const message: IMessage = {
      content: this.messageContent,
      username: this.currentUser.username,
      userUID: this.currentUser.uid,
      photoURL: this.currentUser.photoURL
    }

    this.onMessageSend.emit(message);

    this.messageContent = null;
  }

}
