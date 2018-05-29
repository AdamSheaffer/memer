import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IGame } from '../../interfaces/IGame';
import { IMessage } from '../../interfaces/IMessage';
import { AuthService } from '../../services/auth.service';
import { IPlayer } from '../../interfaces/IPlayer';
import { ChatService } from '../../services/chat.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'memer-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() gameId: string;
  messages$: Observable<IMessage[]>;
  currentUser: IPlayer;
  messageContent: string = null;
  messagesSubscription: Subscription;

  constructor(private authService: AuthService, private chatService: ChatService) {
    this.currentUser = this.authService.getUser();
  }

  ngOnInit() {
    debugger;
    if (this.chatService.gameId !== this.gameId) {
      this.chatService.init(this.gameId);
    }
    this.messages$ = this.chatService.messages$;
  }

  send() {
    if (!this.messageContent || !this.messageContent.trim()) { return; }

    this.chatService.sendMessage(this.currentUser, this.messageContent).then(() => {
      this.messageContent = null;
    });
  }
}
