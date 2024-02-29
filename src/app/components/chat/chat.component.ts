import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { IChatMessage } from '../../models/chat-message';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  messageInput: string = '';
  userId: string = '';
  messageList: any[] = [];

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.chatService.joinRoom('room1');
    this.listenerMessage();
  }

  sendMessage() {
    if (this.messageInput.trim() !== '') {
      const chatMessage: IChatMessage = {
        id: Date.now(),
        message: this.messageInput,
        user: this.userId,
      };
      this.chatService.sendMessage('room1', chatMessage);
      this.messageInput = '';
    }
  }

  listenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {
      this.messageList = messages.map((msg: any) => ({
        ...msg,
        message_side: msg.user === this.userId ? 'sender' : 'receiver',
      }));
    });
  }
}
