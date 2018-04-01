import 'jest';
import { counter, init, increment, CounterAction } from './helpers/counter';
import { undox } from '../src/undox.reducer';
import { UndoxState } from '../src/interfaces/public';

describe('comparator', () => {

  const reducer = undox(counter)
  type UndoxCounter = UndoxState<number, CounterAction>

  it('should not add an action to history if it does not change state', () => {

    const initialState: UndoxCounter = {
      history : [ init(), increment() ],
      index   : 1,
      present : 1
    }

    // init will not change state
    const action = init()

    const actualState = reducer(initialState, action)
    expect(actualState).toEqual(initialState)

  })

  it('should add no action if comparator is defined this way', () => {

    // comparator which always returns that states are equal,
    // so no action should be added to the history
    const reducerWithComparator = undox(counter, init(), (s1, s2) => true)

    const initialState: UndoxCounter = {
      history : [ init() ],
      index   : 0,
      present : 0
    }

    const action = increment()

    const actualState = reducerWithComparator(initialState, action)
    expect(actualState).toEqual(initialState)

  })

  it('should add every action if comparator is defined this way', () => {

    // comparator which always returns that states are non equal,
    // so every action should be added to the history
    const reducerWithComparator = undox(counter, init(), (s1, s2) => false)

    const initialState: UndoxCounter = {
      history : [ init() ],
      index   : 0,
      present : 0
    }

    const action = init()

    const expectedState: UndoxCounter = {
      history : [ init(), init() ],
      index   : 1,
      present : 0
    }

    const actualState = reducerWithComparator(initialState, action)
    expect(actualState).toEqual(expectedState)

  })

}) // ==== comparator ====
