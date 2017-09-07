import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { 
  MdButtonModule,
  MdCardModule,
  MdIconModule,
  MdToolbarModule } from '@angular/material';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StompService } from 'ng2-stomp-service';

import { AppComponent } from './app.component';
import { 
  RestRecipientComponent,
  RestSenderComponent,
  SocketRecipientComponent,
  SocketSenderComponent } from './components';

import { 
  RestAPIServices,
  StompMessageService,
  ReceiverStompService, receiverStompServiceFactory,
  SenderStompService, senderStompServiceFactory } from './services';

import 'hammerjs';


@NgModule({
  declarations: [
    AppComponent,
    RestRecipientComponent,
    RestSenderComponent,
    SocketRecipientComponent,
    SocketSenderComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FlexLayoutModule,
    /* Material Modules */
    MdButtonModule,
    MdCardModule,
    MdIconModule,
    MdToolbarModule,
    
    NgxChartsModule,
  ],
  providers: [
    RestAPIServices,
    StompMessageService,
    {
      provide: ReceiverStompService,
      useFactory: receiverStompServiceFactory
    },
    {
      provide: SenderStompService,
      useFactory: senderStompServiceFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
