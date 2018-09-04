import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { WebsocketService } from './shared/websocket.service';
import { ChatService } from './shared/chat.service';
import { UnitComponent } from './unit/unit.component';
import { HostComponent } from './host/host.component';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes';
import { ClientComponent } from './client/client.component';
import { HomeComponent } from './home/home.component';
import { UnitsService } from './shared/units.service';

@NgModule({
  declarations: [
    AppComponent,
    UnitComponent,
    HostComponent,
    ClientComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [WebsocketService, ChatService, UnitsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
