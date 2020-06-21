// interfaces
export interface Identifiers {
  day: string;
}

export interface ActivityId {
  activityId: string;
}

interface NewDetail {
  key: string;
  value: string | boolean | number;
}

export interface RegisterPayload extends Identifiers {
  activityId: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
}

export interface UnregisterPayload extends Identifiers, ActivityId {}

export interface EditSettingsPayload {
  newSettings: Array<NewDetail>
}
export interface EditActivityPayload extends Identifiers, ActivityId {
  newDetails: Array<NewDetail>;
}

export interface Activity extends Identifiers, ActivityId {
  activityId: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
}

export interface Timetable {
  activities: Array<Activity>;
  settings: Array<NewDetail>
}