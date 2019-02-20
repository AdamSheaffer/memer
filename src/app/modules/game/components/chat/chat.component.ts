import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Message, Player } from '../../../../interfaces';
import { UserService } from '../../../core/services';
import { ChatService } from '../../services';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'memer-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() gameId: string;
  messages$: Observable<Message[]>;
  currentUser: Player;
  messageContent: string = null;
  messagesSubscription: Subscription;

  constructor(private userService: UserService, private chatService: ChatService) {
    this.currentUser = this.userService.getPlayer();
  }

  ngOnInit() {
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
