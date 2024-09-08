import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/Services/Chat/chat.service';
import { CookiesService } from 'src/app/Services/Cookies/cookies.service';

@Component({
  selector: 'app-chat-hub',
  templateUrl: './chat-hub.component.html',
  styleUrls: ['./chat-hub.component.css']
})
export class ChatHubComponent implements OnInit {

  cookiesService = inject(CookiesService);
  chatService = inject(ChatService);
 // userService = inject(UserService);
  inputMessage = "";
  messages: any[] = [];
  users: any[] = [];
  allUsers: {username: string, isOnline: boolean, isAddedToRoom?: boolean}[] = [];
  availableUsers: {username: string, isOnline: boolean, isAddedToRoom?: boolean}[] = [];
  rooms: string[] = [];
  roomUsers: string[] = [];
  selectedRoom: string | null = null;
  router = inject(Router);
  loggedInUserName = this.cookiesService.getUserName();
  isManager = false;
  displayAddUserModal = false;
  usernameToAdd = "";

  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  ngOnInit(): void {
    this.chatService.startConnection().then(() => {
      this.chatService.messages$.subscribe(res => {
        this.messages = res;
      });

      this.chatService.connectedUsers$.subscribe(res => {
        this.users = res;
      });

      this.chatService.rooms$.subscribe(res => {
        this.rooms = res;
        console.log("this is the user:", this.loggedInUserName)
      });

      this.chatService.roomUsers$.subscribe(res => {
        this.roomUsers = res;
      });

      this.chatService.allUsers$.subscribe(res => {
        this.allUsers = res;
      });

      this.chatService.getRooms(); 
      this.chatService.getConnectedUsers(); 
      if (this.isManager) {
        this.chatService.getConsultants();
      }
    }).catch(error => {
      console.error('Error starting SignalR connection: ', error);
    });

    this.chatService.connection.on("OpenRoom", (roomName: string) => {
      if (!this.rooms.includes(roomName)) {
        this.rooms.push(roomName);
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  sendMessage() {
    if (this.selectedRoom) {
      this.chatService.sendMessage(this.inputMessage)
        .then(() => {
          this.inputMessage = '';
        }).catch((err) => {
          console.log(err);
        });
    } else {
      console.log("No room selected");
    }
  }

  selectRoom(roomName: string) {
    this.selectedRoom = roomName;
    this.messages = []; 
    this.chatService.joinRoom(roomName).then(() => {
      console.log(`Joined room: ${roomName}`);
    }).catch(err => {
      console.log('Error joining room:', err);
    });
  }

  
}
