import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as io from 'socket.io-client';
import { ChatService } from 'src/app/service/chat.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('grantAccessForm') grantAccessForm: NgForm;
  chats: any;
  joinned = false;
  newUser = { nickname: '', room: '' };
  msgData = { room: '', nickname: '', message: '' };
  socket = io('http://localhost:4000');
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      this.getChatByRoom(user.room);
      this.msgData = {
        nickname: user.nickname,
        message: user.message,
        room: user.room,
      };
      this.joinned = true;
      this.scrollToBottom();
    }
    this.socket.on('new-message', function (data) {
      if (data.message.room === JSON.parse(localStorage.getItem('user')).room) {
        this.chats.push(data.message);
        this.msgData = {
          nickname: user.nickname,
          room: user.room,
          message: '',
        };
        this.scrollToBottom();
      }
    }.bind(this));
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  getChatByRoom(room): void {
    this.chatService.getChatByRoom(room).subscribe(
      (res) => {
        console.log(res);
        this.chats = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  sendMessage(): void {
    this.chatService.saveChat(this.msgData).subscribe(
      (res) => {
        this.socket.emit('save-message', res);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  joinRoom(): void {
    const date = Date.now();
    localStorage.setItem('user', JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = {
      room: this.newUser.room,
      nickname: this.newUser.nickname,
      message: '',
    };
    this.joinned = true;
    this.socket.emit({
      room: this.newUser.room,
      nickname: this.newUser.nickname,
      message: 'joined this group',
      updateAt: date,
    });
  }

  logout(): void {
    const date = Date.now();
    localStorage.removeItem('user');
    this.msgData = {
      nickname: this.newUser.nickname,
      message: 'left the room',
      room: this.newUser.room,
    };
    this.joinned = false;
  }
}
