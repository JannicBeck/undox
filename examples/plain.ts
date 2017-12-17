import { undox, createSelectors, undo, redo, group, Reducer, UndoxState } from '../';

type CounterState = number;

enum Count {
  INCREMENT = 'INCREMENT_COUNTER',
}

interface Increment {
  type: Count.INCREMENT
}

const increment = (): Increment => {
  return { type: Count.INCREMENT }
}

type CounterAction = Increment

const counter: Reducer<CounterState, CounterAction> = (state = 0, action: CounterAction) => {
  switch (action.type) {
    case Count.INCREMENT:
      return state + 1
    default:
      return state
  }
}

// wrap the counter reducer
const reducer = undox(counter)

// the type of the state shape of our wrapped reducer
type UndoxCounter = UndoxState<CounterState, CounterAction>

// get the selectors to query the new state
const selectors = createSelectors(counter)

const state1 = reducer(undefined, increment())
selectors.getPresentState(state1) // 1

const state2 = reducer(state1, increment())
selectors.getPresentState(state2) // 2

const state3 = reducer(state2, undo())
selectors.getPresentState(state3) // 1

const state4 = reducer(state3, redo())
selectors.getPresentState(state4) // 2

const state5 = reducer(state4, undo())
selectors.getPresentState(state5) // 1

state5 // { history: [ { type: 'undox/INIT' }, type: 'INCREMENT', type: 'INCREMENT' ], index: 1 }

selectors.getPresentAction(state5) // { type: 'INCREMENT' }
selectors.getPastStates(state5)    // [ 0 ]
selectors.getPastActions(state5)   // [ { type: 'undox/INIT' } ]
selectors.getFutureStates(state5)  // [ 2 ]
selectors.getFutureActions(state5) // { type: 'INCREMENT' }

const state6 = reducer(state5, group([ increment(), increment() ]))
selectors.getPresentState(state6) // 3

const state7 = reducer(state6, undo())
selectors.getPresentState(state7) // 1
