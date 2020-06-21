import {
  Action,
  ActionCreator
} from 'redux';

import {
  RegisterPayload,
  UnregisterPayload,
  EditActivityPayload,
  EditSettingsPayload
} from './timetable.state';

// REGISTER_ACTIVITY
export const REGISTER_ACTIVITY: string = "REGISTER_ACTIVITY";
export const registerActivity: ActionCreator<Action> = (payload) => ({
  type: REGISTER_ACTIVITY,
  payload: payload
});

// UNREGISTER_ACTIVITY
export const UNREGISTER_ACTIVITY: string = "UNREGISTER_ACTIVITY";
export const unregisterActivity: ActionCreator<Action> = (payload) => ({
  type: UNREGISTER_ACTIVITY,
  payload: payload
});

// EDIT_ACTIVITY_INFO
export const EDIT_ACTIVITY_INFO: string = "EDIT_ACTIVITY_INFO";
export const editActivityInfo: ActionCreator<Action> = (payload) => ({
  type: EDIT_ACTIVITY_INFO,
  payload: payload
});

// EDIT_SETTINGS
export const EDIT_SETTINGS: string = "EDIT_SETTINGS";
export const editSettings: ActionCreator<Action> = () => ({
  type: EDIT_SETTINGS
});

// TimetableAction
export interface TimetableAction extends Action {
  payload: RegisterPayload | UnregisterPayload | EditActivityPayload | EditSettingsPayload
}