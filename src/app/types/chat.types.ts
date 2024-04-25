export enum ChatType {
  AI,
  USER,
}

export class ChatMessage {
  message: string;
  sender: string;

  constructor(message: string, sender: string) {
    this.message = message;
    this.sender = sender;
  }
}
