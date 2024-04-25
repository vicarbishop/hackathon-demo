import { AfterContentInit, AfterViewInit, Component, DoCheck, EventEmitter, Inject, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { ChatType } from '../../types/chat.types';
import { RtcService } from '../../core/services/rtc-service/rtc.service';
import Peer from 'peerjs';
import { DOCUMENT } from '@angular/common';




const appPrefix = 'hackathon-'; 

@Component({
  selector: 'app-user-chat',
  standalone: true,
  imports: [],
  templateUrl: './user-chat.component.html',
})

export class UserChatComponent implements AfterViewInit, DoCheck {
 // the prefix we will preprend to usernames 
  screen = 'login'; // initialize at login screen 
  usernameInput = '' // to load saved username 
  peerError = ''; 
  targetIdInput = '';
  loading = false; 
  peer: any = {}; // initialize as empty object instead of undefined targetIdInput = ''; 
  peerIds: string[] = []; // connected to nobody at first 
  connections: { [key: string]: any } = {}; // maps peerIds to their corresponding PeerJS's DataConnection objects 
  chats: any[] = []; 
  chatMessageInput = ''; 
  
  constructor(private rtc: RtcService,
    @Inject(document) private document: Document
  ) { 
    const oldChats = localStorage.getItem('chats');
     this.chats = oldChats ? JSON.parse(oldChats) : []; // oldChats may be undefined, which throws error if passed into JSON.parse }
      // in case you want to enable automatic login 
      /*ngOnInit() { if (this.usernameInput && this.usernameInput.length > 0) { this.submitLogin(); } }*/ 
  }
  ngAfterViewInit(): void {
    navigator.mediaDevices.getUserMedia({ video: false, audio: false });
  }
      ngDoCheck() { 
        const chatbox: any = document.getElementById('chatbox'); 
        if (chatbox) chatbox.scrollTop = 99999999; // to automatically scroll the chatbox to the most recent chat message
      } 
      // util functions to convert username to peer ids and vice-versa 
      getPeerId(username: string): string { 
        return appPrefix + username; 
      }
      getUsername(peerId: string): string { 
        return peerId ? peerId.slice(appPrefix.length) : ''; }
         // we keep track of connections ourselves as suggested in peerjs's documentation 
         addConnection(conn: any): void { 
          this.connections[conn.peer] = conn; 
          this.updatePeerIds();
           console.log(`Connected to ${conn.peer}!`);
           }
           removeConnection(conn: any): void { 
            delete this.connections[conn.peer]; 
            this.updatePeerIds(); 
          } 
          updatePeerIds(): void {
             this.peerIds = Object.keys(this.connections); 
            } 
            disconnectPeer(): void { 
              this.peer.disconnect(); 
            } // called to properly configure connection's client listeners 
            configureConnection(conn: any): void { 
              conn.on('data', (data: any) => { 
                // if data is about connections (the list of peers sent when connected) 
                if (data.type === 'connections') { 
                  data.peerIds.forEach((peerId: string) => { 
                    if (!this.connections[peerId]) {
                       this.initiateConnection(peerId); 
                      } 
                    }); 
                  } else if (data.type === 'chat') { 
                    this.receiveChat(data.chat); 
                  }
                  }); 
                  conn.on('close', () => this.removeConnection(conn)); 
                  conn.on('error', () => this.removeConnection(conn)); 
                  conn.metadata.peerIds.forEach((peerId: string) => { 
                    if (!this.connections[peerId]) { 
                      this.initiateConnection(peerId); 
                    } 
                  }); 
                } // called to initiate a connection (by the caller) 
                initiateConnection(peerId: string): void { 
                  if (!this.peerIds.includes(peerId) && peerId !== this.peer.id) {
                     this.loading = true; this.peerError = ''; 
                     console.log(`Connecting to ${peerId}...`);
                     const options = { metadata: { 
                      // if the caller has peers, we send them to merge calls 
                      peerIds: this.peerIds 
                    }, serialization: 'json' }; 
                    const conn = this.peer.connect(peerId, options); 
                    this.configureConnection(conn); 
                    conn.on('open', () => { 
                      this.addConnection(conn); 
                      if (this.getUsername(conn.peer) === this.targetIdInput) {
                         this.targetIdInput = ''; 
                         this.loading = false; 
                        } 
                      }); 
                    } 
                  } 
                  createPeer(): void {                    
                    this.peer = new Peer(this.getPeerId(this.usernameInput), {
                       host: 'ec2-3-131-37-201.us-east-2.compute.amazonaws.com', 
                       port: 9000, path: 'myapp', 
                       key: 'hackathon'}); 
                       // when peer is connected to signaling server 
                       this.peer.on('open', () => { 
                        this.screen = 'chat'; 
                        this.loading = false; 
                        this.peerError = ''; 
                      }); 
                        this.peer.on('error', (error: any) => { 
                          if (error.type === 'peer-unavailable') { 
                            this.loading = false; 
                            this.peerError = `${this.targetIdInput} is unreachable!`;
                            // custom error message 
                            this.targetIdInput = ''; 
                          } else if (error.type === 'unavailable-id') {
                            this.loading = false; 
                            this.peerError = `${this.usernameInput} is already taken!`; 
                            // custom error message 
                          } else this.peerError = error; // default error message 
                        }); // when peer receives a connection 
                        this.peer.on('connection', (conn: any) => { 
                          if (!this.peerIds.includes(conn.peer)) { 
                            this.configureConnection(conn); 
                            conn.on('open', () => { 
                              this.addConnection(conn); // send every connection previously established to connect everyone (merge chat rooms) 
                              conn.send({ type: 'connections', peerIds: this.peerIds }); 
                            }); 
                          } 
                        }); 
                      } 
                      submitLogin(event?: Event): void { 
                        if (event) event.preventDefault(); // to prevent default behavior which is to POST to the same page 
                        if (this.usernameInput.length > 0 && !this.loading) { 
                          this.loading = true; // update status 
                          this.peerError = ''; // reset error status 
                          localStorage.setItem('username', this.usernameInput); // set username cookie to instanciate it at the next session 
                          this.createPeer(); 
                        } 
                      } 
                      submitConnection(event: Event): void { 
                        event.preventDefault(); // to prevent default behavior which is to POST to the same page 
                        const peerId = this.getPeerId(this.targetIdInput); // the peer's id we want to connect to 
                        this.initiateConnection(peerId); 
                      } 
                      receiveChat(chat: any): void { 
                        this.chats.push(chat); 
                        localStorage.setItem('chats', JSON.stringify(this.chats)); 
                      } 
                      submitChat(event: Event): void { 
                        event.preventDefault(); // to prevent default behavior which is to POST to the same page 
                        if (this.chatMessageInput.length > 0) { // the chat object's data 
                          const chatObj = { 
                            sender: this.usernameInput, 
                            message: this.chatMessageInput, 
                            timestamp: new Date().getTime() 
                          }; 
                          this.receiveChat(chatObj); // simulate receiving a chat // send chat object to connected users 
                          Object.values(this.connections).forEach((conn: any) => { 
                            conn.send({ 
                              type: 'chat', 
                              chat: chatObj 
                            }); 
                          }); 
                          this.chatMessageInput = ''; // reset chat message input 
                        } 
                      } 
                     
                    }
              