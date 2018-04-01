import 'jest'
import { counter, CounterAction, init, increment, decrement } from './helpers/counter';
import { undox, createSelectors } from '../src/undox.reducer';
import { UndoxState } from '../src/interfaces/public';


describe('The undox.selectors', () => {

  const reducer = undox(counter, init())
  const selectors = createSelectors(counter)
  type UndoxCounter = UndoxState<number, CounterAction>
  
  describe('select present state', () => {

    it('should select the present state (last)', () => {

      const state: UndoxCounter = {
        history : [ init(), increment(), increment() ],
        index   : 2,
        present : 2
      }

      const actual = selectors.getPresentState(state)

      expect(actual).toEqual(2)

    })

    it('should select the present state (middle)', () => {

      const state: UndoxCounter = {
        history : [ init(), increment(), increment() ],
        index   : 1,
        present : 1
      }

      const actual = selectors.getPresentState(state)

      expect(actual).toEqual(1)

    })

    it('should select the present state (first)', () => {

      const state: UndoxCounter = {
        history : [ init(), increment(), increment() ],
        index   : 0,
        present : 0
      }

      const actual = selectors.getPresentState(state)

      expect(actual).toEqual(0)

    })

    it('should select the present state (grouped)', () => {

      const state: UndoxCounter = {
        history : [ init(), [ increment(), increment() ] ],
        index   : 1,
        present : 2
      }

      const actual = selectors.getPresentState(state)

      expect(actual).toEqual(2)

    })

  })

  describe('select past states', () => {

    it('should select the past states', () => {

      const state: UndoxCounter = {
        history : [ init(), increment(), increment(), increment(), increment(), increment() ],
        index   : 4,
        present : 4
      }
  
      const expected = [ 0, 1, 2, 3 ]
      const actual = selectors.getPastStates(state)
  
      expect(actual).toEqual(expected)

    })

    it('should return an empty array if there are no past states', () => {

      const state: UndoxCounter = {
        history : [ init() ],
        index   : 0,
        present : 0
      }
  
      const expected = [ ]
      const actual = selectors.getPastStates(state)
  
      expect(actual).toEqual(expected)

    })

    it('should select the past states (grouped)', () => {

      const state: UndoxCounter = {
        history : [ init(), [ increment(), increment() ], increment() ],
        index   : 2,
        present : 3
      }
  
      const expected = [ 0, 2 ]
      const actual = selectors.getPastStates(state)
  
      expect(actual).toEqual(expected)

    })

  })

  describe('select past actions', () => {

    it('should select the past actions', () => {

      const state: UndoxCounter = {
        history : [ init(), increment(), decrement() ],
        index   : 2,
        present : 1
      }
    
      const expected = [ init(), increment() ]
      const actual = selectors.getPastActions(state)
    
      expect(actual).toEqual(expected)

    })

    it('should return an empty array if there are no past actions', () => {

      const state: UndoxCounter = {
        history : [ init() ],
        index   : 0,
        present : 0
      }
    
      const expected = [ ]
      const actual = selectors.getPastActions(state)
    
      expect(actual).toEqual(expected)

    })

    it('should select the past actions (grouped)', () => {

      const state: UndoxCounter = {
        history : [ init(), [ increment(), increment() ], decrement() ],
        index   : 2,
        present : 1
      }
    
      const expected = [ init(), increment(), increment() ]
      const actual = selectors.getPastActions(state)
    
      expect(actual).toEqual(expected)

    })

    it('should select the latest action', () => {

      const state: UndoxCounter = {
        history : [ init(), increment(), decrement(), increment() ],
        index   : 2,
        present : 1
      }

      const expected = decrement()
      const actual = selectors.getPresentAction(state)
  
      expect(actual).toEqual(expected)

    })

    it('should select the latest action if there is only the init action', () => {

      const state: UndoxCounter = {
        history : [ init() ],
        index   : 0,
        present : 0
      }

      const expected = init()
      const actual = selectors.getPresentAction(state)
  
      expect(actual).toEqual(expected)

    })

    it('should select the latest action (grouped)', () => {

      const state: UndoxCounter = {
        history : [ init(), [ increment(), decrement() ], increment() ],
        index   : 1,
        present : 0
      }

      const expected = [ increment(), decrement() ]
      const actual = selectors.getPresentAction(state)
  
      expect(actual).toEqual(expected)

    })

  })

  describe('select future states', () => {

    it('should select the future states', () => {

      const state: UndoxCounter = {
        history : [ init(), increment(), increment(), decrement() ],
        index   : 1,
        present : 1
      }

      const expected = [ 2, 1 ]
      const actual = selectors.getFutureStates(state)

      expect(actual).toEqual(expected)

    })

    it('should select the future states', () => {

      const state: UndoxCounter = {
        history : [ init(), increment(), increment(), decrement(), decrement(), decrement(), decrement() ],
        index   : 3,
        present : 1
      }

      const expected = [ 0, -1, -2 ]
      const actual = selectors.getFutureStates(state)

      expect(actual).toEqual(expected)

    })

    it('should return an empty array if there are no future states', () => {

      const state: UndoxCounter = {
        history : [ init(), increment() ],
        index   : 1,
        present : 1
      }

      const expected = [ ]
      const actual = selectors.getFutureStates(state)

      expect(actual).toEqual(expected)

    })

    it('should select the future states (grouped)', () => {

      const state: UndoxCounter = {
        history : [ init(), increment(), [ increment(), increment() ] ],
        index   : 1,
        present : 1
      }

      const expected = [ 3 ]
      const actual = selectors.getFutureStates(state)

      expect(actual).toEqual(expected)

    })

  })

  describe('select future actions', () => {

    it('should select the future actions', () => {

      const state: UndoxCounter = {
        history : [ init(), increment(), increment(), decrement() ],
        index   : 0,
        present : 0
      }

      const expected = [ increment(), increment(), decrement() ]
      const actual = selectors.getFutureActions(state)

      expect(actual).toEqual(expected)

    })

    it('should return an empty array if there are no future actions', () => {

      const state: UndoxCounter = {
        history : [ init() ],
        index   : 0,
        present : 0
      }

      const expected = [ ]
      const actual = selectors.getFutureActions(state)

      expect(actual).toEqual(expected)

    })

    it('should select the future actions (grouped)', () => {

      const state: UndoxCounter = {
        history : [ init(), increment(), [ increment(), decrement() ] ],
        index   : 0,
        present : 0
      }

      const expected = [ increment(), increment(), decrement() ]
      const actual = selectors.getFutureActions(state)

      expect(actual).toEqual(expected)

    })

  })

})
