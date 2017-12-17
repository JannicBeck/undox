import { Reducer } from '../../src/interfaces/public';


type CounterState = number;

enum Count {
  INCREMENT = 'INCREMENT_COUNTER',
  DECREMENT = 'DECREMENT_COUNTER',
  INIT      = 'INIT_COUNTER'
}

export interface Init {
  type: Count.INIT
}

export interface Increment {
  type: Count.INCREMENT
}

export interface Decrement {
  type: Count.DECREMENT
}

export const increment = (): Increment => {
  return { type: Count.INCREMENT }
}

export const decrement = (): Decrement => {
  return { type: Count.DECREMENT }
}

export const init = (): Init => {
  return { type: Count.INIT }
}

export type CounterAction = Init | Increment | Decrement

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
