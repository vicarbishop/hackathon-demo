import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Peer } from 'peerjs';

@Injectable({
  providedIn: 'root',
})
export class RtcService implements OnInit {
  appPrefix = 'secure-p2p-multichat-';
  data: any = {   
    screen: 'login',
    username: '',
    peerError:  '',
    loading: false,
    peer: {},
    targetIdInput: '',
    peerIds: [],
    connections: {},
    chats: {},
    chatMessageInput: ''
  }
  ngOnInit(): void {
    
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: false })
      
      if (typeof navigator !== "undefined") {
        const Peer = require("peerjs").default
      }
  }

  getUsername(user: string) {
    this.data.username = this.appPrefix + user;
    return this.data.username;
  }
  createConnection(conn: any) {
    this.data.connections[conn.peer] = conn;
    this.updatePeerIds();
  }
  endConnection(conn: any) {
    this.data.connections.removeItem(conn.peer);
    this.updatePeerIds();
  }
  updatePeerIds() {
    this.data.peerIds = Object.keys(this.data.connections);
  }
  disconnectPeer() {
    this.data.peer.disconnect();
  }
  
  configConnection(conn: any) {
    conn.on('data', (data: any) => {
      // if data is about connections (the list of peers sent when connected)
      if (data.type === 'connections') {
        data.peerIds.forEach((peerId: any) => {
          if (!this.data.connections[peerId]) {
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
      if (!this.data.connections[peerId]) {
        this.initConnection(peerId);
      }
    });
  }
  initConnection(peerId: string) {
    if (!this.data.peerIds.includes(peerId) && peerId !== this.data.peer.id) {
      this.data.loading = true;
      this.data.peerError = '';

      const options = {
        metadata: {
          peerIds: this.data.peerIds,
        },
        serialization: 'json',
      };

      const conn = this.data.peer.connect(peerId, options);
      this.configConnection(conn);

      conn.on('open', () => {
        this.createConnection(conn);
        if (this.getUsername(conn.peer) === this.data.targetIdInput) {
          this.data.targetIdInput = '';
          this.data.loading = false;
        }
      });
    }
  }
  createPeer() {
    this.data.peer= new Peer("pick-an-id");
    this.data.peer.on('open', () => {
      this.data.screen = 'chat';
      this.data.loading = false;
      this.data.peerError = '';
    });
    this.data.peer.on('error', (error: any) => {
      if (error.type === 'peer-unavailable') {
        this.data.loading = false;
        this.data.peerError = `${this.data.targetIdInput} is unreachable!`;
        this.data.targetIdInput = '';
      } else if (error.type === 'unavailable-id') {
        this.data.loading = false;
        this.data.peerError = `${this.data.username} is already taken!`;
      } else this.data.peerError = error;
    });
    this.data.peer.on('connection', (conn: any) => {
      if (!this.data.peerIds.includes(conn.peer)) {
        this.configConnection(conn);

        conn.on('open', () => {
          this.createConnection(conn);

          conn.send({
            type: 'connections',
            peerIds: this.data.peerIds,
          });
        });
      }
    });
  }
  submitLogin(user: string) {
    if (!this.data.loading) {
      this.data.loading = true;
      this.data.peerError = '';
      this.data.username = user;
      this.createPeer();
    }
  }
  receiveChat(chatMessage: string) {
    this.data.chats.push(chatMessage);
    localStorage.setItem('chats', JSON.stringify(this.data.chats));
  }
  submitChat(chatMessage: string) {
    if (this.data.chatMessageInput.length > 0) {
      let chat = {
        sender: this.data.username,
        message: this.data.chatMessageInput,
        timestamp: new Date().getTime(),
      };

      this.receiveChat(chatMessage);
      Object.values(this.data.connections).forEach((conn: any) => {
        conn.send({
          type: 'chat',
          chat,
        });
      });

      this.data.chatMessageInput = '';
    }
  }

}
