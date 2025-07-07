import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ChatMessage } from './ChatMessage';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class ChatService {
public hubConnection!: signalR.HubConnection;
private readonly huburl = `${environment.apiUrl}/chat`;
//private readonly huburl = 'http://localhost:5000/chatHub'     //--- for localhost ---
public messages: ChatMessage[] = [];

// Add BehaviorSubject to track online and disconnected users
public onlineUsers: string[] = [];
public disconnectedUsers: string[] = [];
public onlineUsersSubject = new BehaviorSubject<string[]>([]);
public disconnectedUsersSubject = new BehaviorSubject<string[]>([]);

constructor() {
    this.startConnection();
}

public registerMessageListener(groupName: string, callback: (msg: ChatMessage) => void): void {
    this.hubConnection.on('ReceiveMessage', (msg: ChatMessage) => {
        console.log(`Received message from ${msg.userName} at ${msg.timestamp}: ${msg.message}`);
        this.messages.push(msg); // Push the full object instead of a string
        callback(msg);
    });
}


public startConnection(): Promise<void> {
  const currentUser = localStorage.getItem('currentUser');
  const token = currentUser ? JSON.parse(currentUser).token : '';

  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.huburl,{
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect([0, 2000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Information)
    .build();

  this.registerConnectionEvents();

  return this.hubConnection.start()
    .then(() => {
        console.log("Connection Started!");
        this.registerOnlineUsersListener();  // <-- Register the online users listener here!
        this.registerGroupMessagesClearedListener(); // Add this line
    })
    .catch(err => {
        console.log("Connection Error:", err);
        throw err;
    });
}



private registerConnectionEvents(): void {
    this.hubConnection.onreconnecting(error => {
    console.warn('SignalR connection lost. Reconnecting...', error);
    });

    this.hubConnection.onreconnected(connectionId => {
    console.log('SignalR reconnected. Connection ID:', connectionId);
    // Optionally, fetch messages after reconnect
    this.getGroupMessages('YourGroupName'); // Specify your group name
    });

    this.hubConnection.onclose(error => {
    console.error('SignalR connection closed due to an error. Attempting to reconnect...', error);
    setTimeout(() => this.startConnection(), 2000); 
    });
}

public sendMessage(user: string, message: string): void {
    this.hubConnection.invoke('SendMessage', user, message)
    .catch(err => console.error('Error while sending message: ' + err));
}

// Updated method to track online users and calculate disconnected users
public registerOnlineUsersListener(): void {
    this.hubConnection.on('UpdateOnlineUsers', (users: string[]) => {
        console.log('Online users:', users);
        const previousOnlineUsers = [...this.onlineUsers];
        this.onlineUsers = users;
        this.onlineUsersSubject.next(this.onlineUsers);
        
        // Update disconnected users list
        this.updateDisconnectedUsers(previousOnlineUsers);
    });
}

// New method to track disconnected users
private updateDisconnectedUsers(previousOnlineUsers: string[]): void {
    // Find users who were online before but are not online now
    const newDisconnectedUsers = previousOnlineUsers.filter(
        user => !this.onlineUsers.includes(user)
    );
    
    // Add new disconnected users to the list (avoid duplicates)
    newDisconnectedUsers.forEach(user => {
        if (!this.disconnectedUsers.includes(user)) {
            this.disconnectedUsers.push(user);
        }
    });
    
    console.log('Disconnected users:', this.disconnectedUsers);
    this.disconnectedUsersSubject.next(this.disconnectedUsers);
}

// New method to explicitly leave a group
public async leaveGroup(groupName: string): Promise<void> {
    if (this.hubConnection.state === 'Connected') {
        try {
            await this.hubConnection.invoke('LeaveGroup', groupName);
            console.log(`Left group: ${groupName}`);
        } catch (err) {
            console.error('Error while leaving group:', err);
            throw err;
        }
    } else {
        console.warn('Cannot leave group: connection is not in connected state');
    }
}

public async joinGroup(groupName: string): Promise<void> {
    try {
        await this.hubConnection.invoke('JoinGroup', groupName);
        console.log(`Joined group: ${groupName}`);

        const previousMessages = await this.getGroupMessages(groupName);
        console.log('Previous group messages:', previousMessages);

        this.messages = Array.isArray(previousMessages) ? previousMessages : [];

    } catch (err) {
        console.error('Error while joining group or fetching messages:', err);
        throw err;
    }
}


public sendMessageToGroup(groupName: string, userId: string, message: string): Promise<void> {
    return this.hubConnection.invoke('SendMessageToGroup', groupName, userId, message)
    .catch(err => {
        console.error('Error while sending message to group: ' + err);
        throw err; // Rethrow the error for handling in the component if needed
    });
}


public async getGroupMessages(groupName: string) {
    if (this.hubConnection.state === 'Connected') {
    try {
        return await this.hubConnection.invoke('GetGroupMessages', groupName);
    } catch (error) {
        console.error('Error retrieving group messages:', error);
        throw error; // Propagate error for handling in the component
    }
    } else {
    console.error('Connection is not in the connected state');
    throw new Error('Cannot send data if the connection is not in the connected state');
    }
}

public async clearGroupMessages(groupName: string): Promise<void> {
    try {
        await this.hubConnection.invoke('ClearGroupMessages', groupName);
        console.log(`Cleared messages for group: ${groupName}`);
    } catch (err) {
        console.error('Error while clearing group messages:', err);
        throw err;
    }
}

private registerGroupMessagesClearedListener(): void {
    this.hubConnection.on('GroupMessagesCleared', (groupName: string) => {
        console.log(`Group messages cleared for group: ${groupName}`);
        // Clear local messages if you are showing messages only for this group:
        this.messages = [];
        // Optionally notify components or refresh UI here, e.g., emit event or call a callback
    });
}

// New method to get disconnected users
public getDisconnectedUsers(): string[] {
    return this.disconnectedUsers;
}

// New method to reset disconnected users list
public resetDisconnectedUsers(): void {
    this.disconnectedUsers = [];
    this.disconnectedUsersSubject.next(this.disconnectedUsers);
}

}
