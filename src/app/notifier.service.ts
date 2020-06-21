import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor() { }

  async scheduleNotification(update: {
    title: string,
    body: string,
    id: number,
    date: Date
  }) {
    let notif = await LocalNotifications.schedule({
      notifications: [
        {
          title: update.title,
          body: update.body,
          id: update.id,
          schedule: {
            every: "second",
            at: update.date
          },
          actionTypeId: null,
          attachments: null,
        }
      ]
    });
    return notif;
  }

  async deleteNotification(id: string) {
    await LocalNotifications.cancel({notifications: [{id: id}]});
    this.getPendingNotifications();
  }
  async notificationAlreadyExists(id) {
    await LocalNotifications.getPending().then(notifObj => {
      for(let notification of notifObj.notifications) {
        if(id === notification.id) {
          return true;
        }
      }
    }); 
  }
  
  async getPendingNotifications() {
    await LocalNotifications.getPending().then(notifObj => {
      console.log(notifObj);
    })
  }
}
