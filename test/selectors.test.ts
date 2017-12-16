import 'jest'
import { counter, CounterAction, init, increment, decrement } from './helpers/counter';
import { undox } from '../src/undox.reducer';
import { UndoxState } from '../src/interfaces/public';


describe('The undox.selectors', () => {

  const undoxCounter = undox(counter, init())
  const { reducer, selectors } = undoxCounter
  type UndoxCounter = UndoxState<number, CounterAction>
  
  it('should select the present state', () => {

    const state: UndoxCounter = {
      history : [ init(), increment(), increment() ],
      index   : 2
    }

    const actual = selectors.getPresentState(state)

    expect(actual).toEqual(2)

  })

  it('should select the past states', () => {

    const state: UndoxCounter = {
      history : [ init(), increment(), decrement() ],
      index   : 2
    }

    const expected = [ 0, 1 ]
    const actual = selectors.getPastStates(state)

    expect(actual).toEqual(expected)

  })

  it('should select the past actions', () => {

    const state: UndoxCounter = {
      history : [ init(), increment(), decrement() ],
      index   : 2
    }

    const expected = [ init(), increment(), decrement() ]
    const actual = selectors.getPastActions(state)

    expect(actual).toEqual(expected)

  })

  it('should select the future states', () => {

    const state: UndoxCounter = {
      history : [ init(), increment(), increment(), decrement() ],
      index   : 1
    }

    const expected = [ 2, 1 ]
    const actual = selectors.getFutureStates(state)

    expect(actual).toEqual(expected)

  })

  it('should select the future actions', () => {

    const state: UndoxCounter = {
      history : [ init(), increment(), increment(), decrement() ],
      index   : 0
    }

    const expected = [ increment(), increment(), decrement() ]
    const actual = selectors.getFutureActions(state)

    expect(actual).toEqual(expected)

  })

})
