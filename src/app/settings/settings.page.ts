import { Component, OnInit } from '@angular/core';

import { PopoverfactoryService } from '../popoverfactory.service';
import { MininavComponent } from '../mininav/mininav.component';

import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  alertTime: string = "2020-06-19T03:05:11.826+01:00";
  constructor(public popverfactory: PopoverfactoryService, public navctrl: NavController) { }
  call() {
    console.log(this.alertTime)
  }
  async presentPopover(ev: any) {
    return await this.popverfactory.presentMiniNavPopover(ev, MininavComponent, {
      links: ["Activities","About","Feedback"]
    });
  }
  ngOnInit() {
  }

}
