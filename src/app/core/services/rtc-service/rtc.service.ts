import { Injectable } from "@angular/core";
import { app } from "../../../../../server";

@Injectable({
    providedIn: "root",
  })
  
  export class RtcService {
    appPrefix = "secure-p2p-multichat-";
    username! : string;
    peerError!: "";
    loading: boolean = false;
    peer: any = {};
    targetIdInput: string = "";
    peerIds!: string[];
    connections: any = {};
    chats!: any;
    chatMessageInput!: string;

    getUsername(user: string){
      this.username = user;
    }
    createConnection(conn:any){
      this.connections[conn.peer] = conn;
      this.updatePeerIds();
    }
    endConnection(conn: any){      
      this.connections.removeItem(conn.peer);
      this.updatePeerIds();
    }
    updatePeerIds() {
        this.peerIds = Object.keys(this.connections);
    }
    disconnectPeer(){
      this.peer.disconnect();
    }
    configConnection(){
      
    }
    initConnection(){}
    createPeer(){
    }
    submitLogin(){}
    receiveChat(){}
    submitChat(){}
  }