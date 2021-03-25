import 'jest';
import { counter, init, increment, CounterAction, decrement } from './helpers/counter';
import { undox } from '../src/undox.reducer';
import { UndoxState } from '../src/interfaces/public';
import { undo } from '../src/undox.action';

describe('limit', () => {

  type UndoxCounter = UndoxState<number, CounterAction>

  it('should allow no past', () => {

    const reducer = undox(counter, init(), _ => false, { past: 0, future: Infinity })

    const initialState: UndoxCounter = {
      history : [ init() ],
      index   : 0,
      present : 0,
      initial : 0
    }

    const action = increment()

    const expectedState: UndoxCounter = {
      history : [ init() ],
      index   : 0,
      present : 1,
      initial : 0
    }

    const actualState = reducer(initialState, action)
    expect(actualState).toEqual(expectedState)

  })

  it('should limit the past', () => {

    const reducer = undox(counter, init(), _ => false, { past: 2, future: Infinity })

    const initialState: UndoxCounter = {
      history : [ init(), increment(), increment() ],
      index   : 2,
      present : 2,
      initial : 0
    }

    const action = increment()

    const expectedState: UndoxCounter = {
      history : [ init(), increment(), increment() ],
      index   : 2,
      present : 3,
      initial : 1
    }

    const actualState = reducer(initialState, action)
    expect(actualState).toEqual(expectedState)

    const expectedState2: UndoxCounter = {
      history : [ init(), increment(), increment() ],
      index   : 2,
      present : 4,
      initial : 2
    }

    const action2 = increment()

    const actualState2 = reducer(expectedState, action2)
    expect(actualState2).toEqual(expectedState2)

    const expectedState3: UndoxCounter = {
      history : [ init(), increment(), decrement() ],
      index   : 2,
      present : 3,
      initial : 3
    }

    const action3 = decrement()

    const actualState3 = reducer(expectedState2, action3)
    expect(actualState3).toEqual(expectedState3)

  })

  it('should limit the past if multiple actions', () => {

    const reducer = undox(counter, init(), _ => false, { past: 2, future: Infinity })

    const initialState: UndoxCounter = {
      history : [ init() ],
      index   : 0,
      present : 0,
      initial : 0
    }

    const actualState1 = reducer(initialState, increment())
    const expectedState1 = {
      history : [ init(), increment() ],
      index   : 1,
      present : 1,
      initial : 0
    }
    expect(actualState1).toEqual(expectedState1)
    const actualState2 = reducer(expectedState1, increment())
    const expectedState2 = {
      history : [ init(), increment(), increment() ],
      index   : 2,
      present : 2,
      initial : 0
    }
    expect(actualState2).toEqual(expectedState2)
    const actualState3 = reducer(expectedState2, increment())
    const expectedState3 = {
      history : [ init(), increment(), increment() ],
      index   : 2,
      present : 3,
      initial : 1
    }
    expect(actualState3).toEqual(expectedState3)
    const actualState4 = reducer(expectedState3, increment())
    const expectedState4 = {
      history : [ init(), increment(), increment() ],
      index   : 2,
      present : 4,
      initial : 2
    }
    expect(actualState4).toEqual(expectedState4)
    const actualState5 = reducer(expectedState4, undo())
    const expectedState5 = {
      history : [ init(), increment(), increment() ],
      index   : 1,
      present : 3,
      initial : 2
    }
    expect(actualState5).toEqual(expectedState5)

  })

  it('should allow no future', () => {

    const reducer = undox(counter, init(), _ => false, { future: 0, past: Infinity })

    const initialState: UndoxCounter = {
      history : [ init(), increment() ],
      index   : 1,
      present : 1,
      initial : 0
    }

    const action = undo()

    const expectedState: UndoxCounter = {
      history : [ init() ],
      index   : 0,
      present : 0,
      initial : 0
    }

    const actualState = reducer(initialState, action)
    expect(actualState).toEqual(expectedState)

  })


  it('should limit the future', () => {

    const reducer = undox(counter, init(), _ => false, { future: 1, past: Infinity })

    const initialState: UndoxCounter = {
      history : [ init(), increment(), increment() ],
      index   : 1,
      present : 1,
      initial : 0
    }

    const action = undo()

    const expectedState: UndoxCounter = {
      history : [ init(), increment() ],
      index   : 0,
      present : 0,
      initial : 0
    }

    const actualState = reducer(initialState, action)
    expect(actualState).toEqual(expectedState)

  })


}) // ==== limit ====
