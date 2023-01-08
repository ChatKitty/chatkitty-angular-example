import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DoBootstrap, Injector, NgModule } from '@angular/core';

import { createCustomElement } from '@angular/elements';
import { ChatModule, ChatWidgetComponent } from './@chat/';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, ChatModule],
  exports: [ChatModule]
})
export class ElementModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const chatWidget = <any>createCustomElement(ChatWidgetComponent, {
      injector: this.injector
    });
    customElements.define('chat-widget', chatWidget);
  }
}
