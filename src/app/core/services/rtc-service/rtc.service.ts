import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class RtcService {
  appPrefix = 'secure-p2p-multichat-';
  screen: string = 'login';
  username!: string;
  peerError: string = '';
  loading: boolean = false;
  peer: any = {};
  targetIdInput: string = '';
  peerIds!: string[];
  connections: any = {};
  chats!: any;
  chatMessageInput!: string;

  getUsername(user: string) {
    this.username = this.appPrefix + user;
    return this.username;
  }
  createConnection(conn: any) {
    this.connections[conn.peer] = conn;
    this.updatePeerIds();
  }
  endConnection(conn: any) {
    this.connections.removeItem(conn.peer);
    this.updatePeerIds();
  }
  updatePeerIds() {
    this.peerIds = Object.keys(this.connections);
  }
  disconnectPeer() {
    this.peer.disconnect();
  }
  configConnection(conn: any) {
    conn.on('data', (data: any) => {
      // if data is about connections (the list of peers sent when connected)
      if (data.type === 'connections') {
        data.peerIds.forEach((peerId: any) => {
          if (!this.connections[peerId]) {
            this.initConnection(peerId);
          }
        });
      } else if (data.type === 'chat') {
        this.receiveChat(data.chat);
      }
      // please note here that if data.type is undefined, this endpoint won't do anything!
    });
    conn.on('close', () => this.endConnection(conn));
    conn.on('error', () => this.endConnection(conn));

    // if the caller joins have a call, we merge calls
    conn.metadata.peerIds.forEach((peerId: any) => {
      if (!this.connections[peerId]) {
        this.initConnection(peerId);
      }
    });
  }
  initConnection(peerId: string) {
    if (!this.peerIds.includes(peerId) && peerId !== this.peer.id) {
      this.loading = true;
      this.peerError = '';

      const options = {
        metadata: {
          peerIds: this.peerIds,
        },
        serialization: 'json',
      };

      const conn = this.peer.connect(peerId, options);
      this.configConnection(conn);

      conn.on('open', () => {
        this.createConnection(conn);
        if (this.getUsername(conn.peer) === this.targetIdInput) {
          this.targetIdInput = '';
          this.loading = false;
        }
      });
    }
  }
  createPeer() {
    var peerObj = new this.peer(this.username, {
      host: environment.hostName,
      port: 900,
      path: 'myapp',
      key: 'hackathon',
      proxied: true,
    });
    this.peer.on('open', () => {
      this.screen = 'chat';
      this.loading = false;
      this.peerError = '';
    });
    this.peer.on('error', (error: any) => {
      if (error.type === 'peer-unavailable') {
        this.loading = false;
        this.peerError = `${this.targetIdInput} is unreachable!`;
        this.targetIdInput = '';
      } else if (error.type === 'unavailable-id') {
        this.loading = false;
        this.peerError = `${this.username} is already taken!`;
      } else this.peerError = error;
    });
    this.peer.on('connection', (conn: any) => {
      if (!this.peerIds.includes(conn.peer)) {
        this.configConnection(conn);

        conn.on('open', () => {
          this.createConnection(conn);

          conn.send({
            type: 'connections',
            peerIds: this.peerIds,
          });
        });
      }
    });
  }
  submitLogin(user: string) {
    if (!this.loading) {
      this.loading = true;
      this.peerError = '';
      this.username = user;
      this.createPeer();
    }
  }
  receiveChat(chatMessage: string) {
    this.chats.push(chatMessage);
    localStorage.setItem('chats', JSON.stringify(this.chats));
  }
  submitChat(chatMessage: string) {
    if (this.chatMessageInput.length > 0) {
      let chat = {
        sender: this.username,
        message: this.chatMessageInput,
        timestamp: new Date().getTime(),
      };

      this.receiveChat(chatMessage);
      Object.values(this.connections).forEach((conn: any) => {
        conn.send({
          type: 'chat',
          chat,
        });
      });

      this.chatMessageInput = '';
    }
  }
}
