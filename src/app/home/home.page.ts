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
    public navController: NavController
  ) {

    getObject().then(res => {
      let content = res.content || undefined;
      if(!content) {
        setObject(initialState);
      }
    })
    
    let today = new Date().getDay();
    this.day = this.days[today];
    this.fullDay = this.fullDays[today];
    this.store.subscribe(() => this.readState());
    this.readState();
  }


  async presentPopover(ev: any) {
    return await this.popoverfactory.presentMiniNavPopover(ev, MininavComponent, {
      links: ["Settings","About","Feedback"]
    });
  }

  ngOnInit() {
    console.log(this.navController);
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
      console.log(ev);
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

  deleteActivity(activityId: string) {
    this.store.dispatch(actions.unregisterActivity({ activityId: activityId }));
  }

  changeScreen(ev: any) {
    this.setCurrentDay(ev.detail.value);
  }

  setCurrentDay(day: string) {
    this.day = day;
    this.fullDay = this.fullDays[this.days.indexOf(day)];
    this.reloadActivities();
  }

  reloadActivities() {
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
    }))
    this.reloadActivities();
  }

  updateValue(activityId: string, target, newValue: any) {
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
  }

  generateId() {
    function random(seed) {
      return Math.floor(Math.random() * seed);
    }
    return `ti${random(8734)}me-ta${random(284)}b-l${random(17892)}e`;
  }
  
  readState() {
    const state: Timetable = this.store.getState() as Timetable;
    this.activities = state.activities.filter(activity => activity.day === this.day);
    setObject(state);
  }

  sayHi(ev = 'hi')  {
    console.log(ev);
  }

}
