import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PopoverfactoryService } from '../popoverfactory.service';

import { SettingsPage } from '../settings/settings.page';

@Component({
  selector: 'app-mininav',
  templateUrl: './mininav.component.html',
  styleUrls: ['./mininav.component.scss'],
})
export class MininavComponent implements OnInit {
  links: Array<string>;
  constructor(private navctrl: NavController, private popoverfactory: PopoverfactoryService) { }

  navigate(link: string) {
    this.navctrl.navigateForward(link, {
      animated: true
    });
  }

  ngOnInit() {}

}
