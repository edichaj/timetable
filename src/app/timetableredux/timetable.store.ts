import {
  Store,
  Action,
  createStore,
  StoreEnhancer,
  compose
} from 'redux';

import { InjectionToken } from '@angular/core';

import { Timetable } from './timetable.state';
import { TimetableAction } from './timetable.actions';
import { timetableTopLevelReducer } from './timetable.reducer';


let devtools: StoreEnhancer<Timetable> = window['devToolsExtension'] ? window['devToolsExtension']() : f => f;
export const TIMETABLE_STORE_TOKEN: InjectionToken<Store<Timetable>> = new InjectionToken<Store<Timetable>>('TIMETABLE_STORE');

export function createTimetableStore(): Store<Timetable> {
  return createStore<Timetable, Action<Timetable>,{},{}>(
    timetableTopLevelReducer,
    compose(devtools)
  )
}

export const timetableStoreProviders = [
  {provide: TIMETABLE_STORE_TOKEN, useFactory: createTimetableStore}
]