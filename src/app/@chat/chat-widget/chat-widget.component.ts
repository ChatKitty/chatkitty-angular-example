import {
  Component,
  ElementRef, EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { fadeIn, fadeInOut } from '../animations';

import ChatKitty, {
  Channel,
  CurrentUser,
  Message, TextMessage, TextUserMessage,
} from '@chatkitty/core';

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
  animations: [fadeInOut, fadeIn]
})
export class ChatWidgetComponent implements OnInit, OnDestroy {
  private readonly kitty = ChatKitty.getInstance(
    'afaac908-1db3-4b5c-a7ae-c040b9684403'
  );

  public user: CurrentUser;
  public channel: Channel;
  public messages: TextUserMessage[] = [];

  @ViewChild('bottom') bottom: ElementRef;

  public focus = new EventEmitter();

  private _visible = true;

  public get visible() {
    return this._visible;
  }

  @Input()
  public set visible(visible) {
    this._visible = visible;

    if (this._visible) {
      setTimeout(() => {
        this.scrollToBottom();
        this.focusMessage();
      }, 0);
    }
  }

  public appendMessage(message: TextUserMessage) {
    this.messages.unshift(message);
    this.scrollToBottom();
  }

  public scrollToBottom() {
    if (this.bottom !== undefined) {
      this.bottom.nativeElement.scrollIntoView();
    }
  }

  public focusMessage() {
   if (this.channel) {
     this.kitty
       .readChannel({
         channel: this.channel
       })
       .then(() => {
         this.focus.next(true);
       });
   }
  }

  async ngOnInit() {
    const startSessionResult = await this.kitty.startSession({
      username: 'c6f75947-af48-4893-a78e-0e0b9bd68580'
    });

    if (startSessionResult.succeeded) {
      this.user = startSessionResult.session.user;
    }

    const retrieveChannelResult = await this.kitty.retrieveChannel(55002);

    if (retrieveChannelResult.succeeded) {
      this.channel = retrieveChannelResult.channel;

      const listMessagesResult = await this.kitty.listMessages({
        channel: retrieveChannelResult.channel
      });

      if (listMessagesResult.succeeded) {
        this.messages = listMessagesResult.paginator.items as TextUserMessage[];
      }

      this.kitty.startChatSession({
        channel: this.channel,
        onMessageReceived: (message: Message) => {
          this.appendMessage(message as TextUserMessage);

          if (!this._visible) {
            this.visible = true;
          }
        }
      });
    }
  }

  public toggleChat() {
    this.visible = !this.visible;
  }

  public async sendMessage({ message }: { message: string }) {
    if (message.trim() === '') {
      return;
    }

    await this.kitty.sendMessage({
      channel: this.channel,
      body: message
    });
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === '/') {
      this.focusMessage();
    }
    if (event.key === '?' && !this._visible) {
      this.toggleChat();
    }
  }

  async ngOnDestroy() {
    await this.kitty.endSession();
  }
}
