import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PopoverfactoryService {
  lastPopover: any;
  constructor(private popoverController: PopoverController) { }

  async presentMiniNavPopover(ev: any, component, props) {
    const popover = await this.popoverController.create({
      component: component,
      componentProps: props,
      event: ev,
      showBackdrop: true,
      translucent: true
    });
    let pop = await popover.present();
    this.lastPopover = pop;
    return pop;
  }
}
