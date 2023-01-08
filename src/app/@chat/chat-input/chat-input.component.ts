import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-chat-input',
  template: `
    <textarea
      type="text"
      class="chat-input-text"
      placeholder="Type message..."
      rows="2"
      #message
      (keydown.enter)="onSubmit()"
      (keyup.enter)="message.value = ''"
      (keyup.escape)="dismiss.emit()"
    ></textarea>
    <button type="submit" class="chat-input-submit" (click)="onSubmit()">
      {{ buttonText }}
    </button>
  `,
  encapsulation: ViewEncapsulation.ShadowDom,
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent implements OnInit {
  @Input() public buttonText = '↩';
  @Input() public focus = new EventEmitter();
  @Output() public send = new EventEmitter();
  @Output() public dismiss = new EventEmitter();
  @ViewChild('message', { static: true }) message: ElementRef;

  ngOnInit() {
    this.focus.subscribe(() => this.focusMessage());
  }

  public focusMessage() {
    this.message.nativeElement.focus();
  }

  public getMessage() {
    return this.message.nativeElement.value;
  }

  public clearMessage() {
    this.message.nativeElement.value = '';
  }

  onSubmit() {
    const message = this.getMessage();
    if (message.trim() === '') {
      return;
    }
    this.send.emit({ message });
    this.clearMessage();
    this.focusMessage();
  }
}
