import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatAvatarComponent } from './chat-avatar/chat-avatar.component';
import { ChatWidgetComponent } from './chat-widget/chat-widget.component';
import { ChatInputComponent } from './chat-input/chat-input.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ChatAvatarComponent, ChatWidgetComponent, ChatInputComponent],
  exports: [ChatWidgetComponent],
  entryComponents: [ChatWidgetComponent]
})
export class ChatModule {}
