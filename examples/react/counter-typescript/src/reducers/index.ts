import { undox, createSelectors, UndoxState } from 'undox';
import { counter, CounterState } from './counter';
import { CounterAction, init } from '../actions';

export type State = UndoxState<CounterState, CounterAction>
export const reducer = undox(counter, init())
export const selectors = createSelectors(counter)
