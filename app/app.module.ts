import { HomeComponent } from './home.component/home.component';
import { NotificationsService } from './common/notifications.service';
import { GlobalService } from './common/global.service';
import { AppComponent } from './app.component/app.component';
import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import {RouterModule} from '@angular/router';
import {routes} from './app.routes';
import {AuthGuard} from './common/authGuard/authGuard';
import {APP_BASE_HREF} from '@angular/common';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ 
      
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  providers: [
      NotificationsService,
      GlobalService      
    //   AuthGuardClient,
    //   AuthGuardDriver
  ],
  bootstrap: [
    AppComponent    
  ]
})
export class AppModule {
    constructor() {
        console.log('app.module 1');
    }
};
