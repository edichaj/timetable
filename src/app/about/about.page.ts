import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { PopoverfactoryService } from '../popoverfactory.service';
import { MininavComponent } from '../mininav/mininav.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(private popoverfactory: PopoverfactoryService, public navctrl: NavController) { }

  async presentPopover(ev: any) {
    return await this.popoverfactory.presentMiniNavPopover(ev, MininavComponent, {
      links: ["Activities","Settings","Feedback"]
    });
  }

  ngOnInit() {
  }

}
