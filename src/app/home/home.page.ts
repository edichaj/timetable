import { 
  Component, 
  Inject, 
  OnInit,
  AfterViewInit, 
  ElementRef, 
  ViewChild 
} from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ToastController, NavController } from '@ionic/angular';


import '../../assets/hammer.min';
import { Store } from 'redux';
import { TIMETABLE_STORE_TOKEN } from '../timetableredux/timetable.store';
import { Timetable, Activity } from '../timetableredux/timetable.state';
import * as actions from '../timetableredux/timetable.actions';
import { getObject, setObject, initialState } from '../timetableredux/timetable.reducer';
import { MininavComponent } from '../mininav/mininav.component';
import { PopoverfactoryService } from '../popoverfactory.service';
import { NotifierService } from '../notifier.service';

declare let Hammer: any;
const { LocalNotifications } = Plugins;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  days: Array<string> = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
  fullDays: Array<string> = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  day: string;
  fullDay: string;
  navSegmentName: string = "days";
  @ViewChild('mainContent') mainContent: ElementRef | any;

  activities: Array<Activity>;
  constructor(
    @Inject(TIMETABLE_STORE_TOKEN) private store: Store<Timetable>,
    public toastController: ToastController,
    public popoverfactory: PopoverfactoryService,
    public navController: NavController,
    private notifier: NotifierService
  ) {

    getObject().then(res => {
      let content = res.content || undefined;
      if(!content) {
        setObject(initialState);
      }
    });

    let today = new Date().getDay();
    this.day = this.days[today];
    this.fullDay = this.fullDays[today];
    this.store.subscribe(() => this.readState());
    this.readState();

     // set notifications for all the activities for today
     for(let activity of this.activities) {
       this.scheduleActivity(activity.activityId)
     }
  }


  async presentPopover(ev: any) {
    return await this.popoverfactory.presentMiniNavPopover(ev, MininavComponent, {
      links: ["Settings","About","Feedback"]
    });
  }

  ngOnInit() {
    let todaysTasks = [];
    getObject().then(response => {
      let today = this.days[new Date().getDay()];
      for(let activity of response.content.activities) {
        if(activity.day === today) {
          todaysTasks.push(activity);
        }
      } 
    })
  }

  ngAfterViewInit() {
    this.setCurrentDay(this.day);
    let hamma = new Hammer(this.mainContent.el);
    hamma.on('swipe',(ev) => {
      let hasNotFailedTests = (ev.distance < 200) && 
                              !(["input","ion-item-group"].includes(ev.target.localName));
      if((ev.direction === 2 || ev.direction === 3) && hasNotFailedTests) {
        let nextIndex = this.days.indexOf(this.day) + 1;
        if(nextIndex < this.days.length) {
          this.day = this.days[nextIndex];
        }
      }
      if((ev.direction === 4 || ev.direction === 1) && hasNotFailedTests) {
        let prevIndex = this.days.indexOf(this.day) - 1;
        if(prevIndex >= 0) {
          this.day = this.days[prevIndex];
        }
      }
    });
  }

  async deleteActivity(activityId: string) {
    this.store.dispatch(actions.unregisterActivity({ activityId: activityId }));
    await this.notifier.deleteNotification(activityId);
  }

  setCurrentDay(day: string) {
    this.day = day;
    this.readState();
  }

  async presentToast(message, duration) {
    const toast = await this.toastController.create({
      message: message,
      animated: true,
      duration: duration
    });
    toast.present();
  }

  addBlankActivity() {
    let selectedDayTasks = this.activities.filter(activity => activity.day === this.day);
    if(selectedDayTasks.length > 0) {
      let alias = selectedDayTasks;
      let targetActivities = alias.filter(activity => {
        return (!activity.title || !activity.startTime || !activity.endTime);
      })

      for(let targetActivity of targetActivities) {
        let activityContainer = document.getElementById(targetActivity.activityId);
        activityContainer.classList.add('invalid');
        setTimeout(() => {
          activityContainer.classList.remove('invalid');
        },500)
      }

      if(targetActivities.length > 0) {
        this.presentToast("Unable to add new activity",1000);
        return;
      }
    }

    this.store.dispatch(actions.registerActivity({
      activityId: this.generateId(),
      day: this.day,
      title: '',
      description: '',
      startTime: undefined,
      endTime: undefined
    }));
  }

  async updateValue(activityId: string, target, newValue: any) {
    let payload;
    switch(target) {
      case 'title':
        payload = {title: newValue};
        break;
      case 'description':
        payload = {description: newValue};
        break;
      case 'starttime':
        payload = {startTime: newValue};
        break;
      case 'endtime':
        payload = {endTime: newValue};
        break;
      default:
        payload = {title: newValue}
    }
    this.store.dispatch(actions.editActivityInfo(
      { 
        activityId: activityId, 
        newDetails: [payload]
      }
    ));
    setObject(this.store.getState());

    if(target === "title" || target === "starttime") {
      await this.scheduleActivity(activityId);
    }
    
  }

  async scheduleActivity(activityId: string) {
    let alias = [...this.store.getState().activities];
    let activity = <Activity>alias.filter(activity => activity.activityId === activityId)[0];
    let today = new Date().getDay();
    if(this.days.indexOf(activity.day) === today) {
      this.notifier.scheduleNotification({
        title: 'Your timetable',
        body: `${activity.title} starting in the next few moments`,
        id: Number(activityId),
        date: new Date(activity.startTime)
      });
    }

  }

  generateId() {
    function random(seed) {
      return Math.floor(Math.random() * seed);
    }
    return String( random(1712625374) );
  }
  
  readState() {
    const state: Timetable = this.store.getState() as Timetable;
    let alias: Array<Activity> = [...state.activities];
    this.activities = alias.filter(activity => activity.day === this.day);
    setObject(state);
  }

  sayHi(ev = 'hi')  {
    console.log(ev);
  }

}
