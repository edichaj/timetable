import { Reducer, Action } from 'redux';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

import * as actions from './timetable.actions';

import { 
   Activity,
   Timetable,
   RegisterPayload,
   UnregisterPayload,
   EditActivityPayload,
   EditSettingsPayload
  } from './timetable.state';

export const initialState: Timetable = {
  activities: [
  ],
  settings: [
    {key: "editable", value: true}
  ]
};

// JSON "get" example
export async function getObject() {
  const ret = await Storage.get({ key: 'timetable' });
  return JSON.parse(ret.value);
}

export async function setObject(data) {
  await Storage.set({
    key: 'timetable',
    value: JSON.stringify({
      id: 1000,
      content: data
    })
  });
}

let utilizedInitialState: Timetable;

getObject().then(response => {
  if(!response.content) {
    utilizedInitialState = initialState;
  } else {
    utilizedInitialState = response.content;
  }
})



// top level reducer (receives actions and call the appropriate helpers)
export const timetableTopLevelReducer: Reducer<Timetable> = (state: Timetable = utilizedInitialState, action: actions.TimetableAction): Timetable => {
  switch(action.type) {
    case actions.REGISTER_ACTIVITY:
      return registerActivity(state,<RegisterPayload>action.payload);
    case actions.UNREGISTER_ACTIVITY:
      return unregisterActivity(state,<UnregisterPayload>action.payload);
    case actions.EDIT_ACTIVITY_INFO:
      return editActivityInfo(state,<EditActivityPayload>action.payload);
    case actions.EDIT_SETTINGS:
      return editSettings(state,<EditSettingsPayload>action.payload);
    default:
      return state;
  }
}

// helpers
function registerActivity(state: Timetable, payload: RegisterPayload): Timetable {
  let activity: Activity = {
    activityId: payload.activityId,
    day: payload.day,
    title: payload.title,
    description: payload.description,
    startTime: payload.startTime,
    endTime: payload.endTime
  }
  let activities = state.activities.concat(activity);

  setObject(Object.assign)
  return Object.assign({},state,{
    activities: activities
  });
}

function unregisterActivity(state: Timetable, payload: UnregisterPayload): Timetable {
  let remainingActivities = [...state.activities.filter(activity => activity.activityId !== payload.activityId)];
  return Object.assign({},state,{
    activities: remainingActivities
  });
}

function editActivityInfo(state: Timetable, payload: EditActivityPayload): Timetable {
  let targetActivity = [...state.activities.filter(activity => activity.activityId === payload.activityId)][0];
  let alias = [...state.activities];
  let targetActivityIndex = state.activities.indexOf(targetActivity);
  let tasksBeforeTarget = [...alias].splice(0,targetActivityIndex);
  let tasksAfterTarget = [...alias].splice(targetActivityIndex + 1);
  console.log(targetActivityIndex,tasksBeforeTarget,tasksAfterTarget);

  for(let newDetail of payload.newDetails) {
    targetActivity[Object.keys(newDetail)[0]] = Object.values(newDetail)[0];
  }
  
  return Object.assign({},state,{
    activities: tasksBeforeTarget.concat(targetActivity,...tasksAfterTarget)
  });
}

function editSettings(state: Timetable, payload: EditSettingsPayload): Timetable {
  let settings = [...state.settings];

  for(let newSetting of payload.newSettings) {
    for(let setting of settings) {
      if(setting.key === Object.keys(newSetting)[0]) {
        setting[Object.keys(newSetting)[0]] = Object.values(newSetting)[0];
      }
    }
  }

  return Object.assign({}, state, {
    settings: settings
  });
}