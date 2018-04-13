import { Reducer } from 'undox';
import { CounterAction, Count } from '../actions';

export type CounterState = number;

export const counter: Reducer<CounterState, CounterAction> = (state = 0, action: CounterAction) => {

  switch (action.type) {

    case Count.INCREMENT:
      return state + 1

    case Count.DECREMENT:
      return state - 1

    default:
      return state

  }

}
