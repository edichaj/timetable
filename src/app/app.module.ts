import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import{ FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { MininavComponent } from './mininav/mininav.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { timetableStoreProviders } from './timetableredux/timetable.store';
import { PopoverfactoryService } from './popoverfactory.service';


@NgModule({
  declarations: [
    MininavComponent,
    AppComponent],
  imports: [
      BrowserModule, 
      FormsModule, 
      ReactiveFormsModule, 
      IonicModule.forRoot(), 
      AppRoutingModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    timetableStoreProviders,
    PopoverfactoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
