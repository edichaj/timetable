import { Component, OnInit } from '@angular/core';

import { PopoverfactoryService } from '../popoverfactory.service';
import { MininavComponent } from '../mininav/mininav.component';

import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  constructor(public popoverfactory: PopoverfactoryService, public navctrl: NavController) { }

  async presentPopover(ev: any) {
    return await this.popoverfactory.presentMiniNavPopover(ev, MininavComponent, {
      links: ["Activities","Settings","About"]
    });
  }

  ngOnInit() {
  }

}
