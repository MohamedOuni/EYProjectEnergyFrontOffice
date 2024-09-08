import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public connection: signalR.HubConnection;
  public messages$ = new BehaviorSubject<any[]>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public rooms$ = new BehaviorSubject<string[]>([]);
  public roomUsers$ = new BehaviorSubject<string[]>([]);
  public allUsers$ = new BehaviorSubject<{username: string, isOnline: boolean, isAddedToRoom?: boolean}[]>([]);
  public messages: any[] = [];

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5022/chat")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.startConnection();
  }

  public async startConnection() {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log("Connection established!");
        await this.getRooms();
        await this.getConnectedUsers();
        await this.getConsultants();
        this.registerOnServerEvents();
      } catch (error) {
        console.error("Error starting SignalR connection: ", error);
      }
    }
  }

  private registerOnServerEvents() {
    this.connection.on("ReceiveMessage", (user: string, message: string, messageTime: string) => {
      this.messages.push({ user, message, messageTime });
      this.messages$.next(this.messages);
    });

    this.connection.on("ConnectedUser", (users: any[]) => {
      this.connectedUsers$.next(users);
    });

    this.connection.on("OpenRoom", (roomName: string) => {
      this.rooms$.next([...this.rooms$.value, roomName]); // Add the room to the list of rooms
      this.joinRoom(roomName);
    });

    this.connection.on("LoadMessages", (messages: any[]) => {
      this.messages = messages;
      this.messages$.next(this.messages);
    });

    this.connection.on("NotAuthorized", () => {
      console.warn("You are not authorized to join this room.");
    });

    this.connection.on("UserRooms", (roomNames: string[]) => {
      this.rooms$.next(roomNames);
    });

    this.connection.on("AllUsers", (users: {username: string, isOnline: boolean}[]) => {
      this.allUsers$.next(users);
    });

    this.connection.on("UserAddedToRoom", (username: string, roomName: string) => {
      this.updateUserListAfterAddingToRoom(username, roomName);
    });
  }

  private updateUserListAfterAddingToRoom(username: string, roomName: string) {
    const updatedUsers = this.allUsers$.value.map(user => {
      if (user.username === username) {
        user.isAddedToRoom = true;
      }
      return user;
    });
    this.allUsers$.next(updatedUsers);
  }

  public async createRoom(roomName: string) {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      return this.connection.invoke("CreateRoom", roomName);
    }
  }

  public async addUserToRoom(username: string, roomName: string) {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      return this.connection.invoke("AddUserToRoom", username, roomName);
    }
  }

  public async sendMessage(message: string) {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      return this.connection.invoke("SendMessage", message);
    }
  }

  public async getRooms() {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
        const rooms = await this.connection.invoke<string[]>("GetRooms");
        this.rooms$.next(rooms);
    }
}

  public async getUsersInRoom(roomName: string) {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      const users = await this.connection.invoke<string[]>("GetUsersInRoom", roomName);
      this.roomUsers$.next(users);
    }
  }

  public async joinRoom(roomName: string) {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("JoinRoom", roomName);
      this.getUsersInRoom(roomName);
    }
  }

  public async getConnectedUsers() {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      const users = await this.connection.invoke<string[]>("GetConnectedUsers");
      this.connectedUsers$.next(users);
    }
  }

  public async getAllUsers() {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      const users = await this.connection.invoke<{username: string, isOnline: boolean}[]>("GetAllUsers");
      this.allUsers$.next(users);
    }
  }

  public async getConsultants() {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      const consultants = await this.connection.invoke<{username: string, isOnline: boolean}[]>("GetConsultants");
      this.allUsers$.next(consultants);
    }
  }
}