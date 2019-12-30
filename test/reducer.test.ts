import 'jest';
import { undox } from '../src/undox.reducer';
import { UndoxState } from '../src/interfaces/public';
import { UndoxTypes, undo, redo, group, UndoAction, RedoAction } from '../src/undox.action';
import { counter, init, increment, decrement, CounterAction } from './helpers/counter';


describe('The undox.reducer', () => {

  const reducer = undox(counter, init())
  type UndoxCounter = UndoxState<number, CounterAction>

  describe('initial state', () => {

    it('should produce a default initAction', () => {

      const reducer = undox(counter)

      const expectedState: UndoxCounter = {
        history : [ { type: 'undox/INIT' } as any ],
        index   : 0,
        present : 0
      }

      expectedState.index = 0

      const actualState = reducer(undefined, {} as any)
      expect(actualState).toEqual(expectedState)

    })

    it('should use the custom initAction', () => {

      const initAction = init()
      const reducer = undox(counter, initAction)

      const expectedState: UndoxCounter = {
        history : [ initAction ],
        index   : 0,
        present : 0
      }

      const actualState = reducer(undefined, {} as any)
      expect(actualState).toEqual(expectedState)

    })

  }) // ==== initial state ====


  describe('forwarding actions', () => {

    it('should call the given reducer on increment action', () => {

      const initialState: UndoxCounter = undefined

      const incrementAction = increment()

      const expectedState: UndoxCounter = {
        history : [ init(), incrementAction ],
        index   : 1,
        present : 1
      }

      const actualState = reducer(initialState, incrementAction)
      expect(actualState).toEqual(expectedState)

    })

    it('should call the given reducer on decrement action', () => {

      const initialState: UndoxCounter = undefined
      const decrementAction = decrement()

      const expectedState: UndoxCounter = {
        history : [ init(), decrementAction ],
        index   : 1,
        present : -1
      }

      const actualState = reducer(initialState, decrementAction)
      expect(actualState).toEqual(expectedState)

    })

    it('should wipe the future when an action is forwarded', () => {

      const initialState: UndoxCounter = {
        history : [ init(), increment(), increment(), increment(), increment() ],
        index   : 1,
        present : 1
      }

      const decrementAction = decrement()

      const expectedState: UndoxCounter = {
        history : [ init(), increment(), decrement() ],
        index   : 2,
        present : 0
      }

      const actualState = reducer(initialState, decrementAction)
      expect(actualState).toEqual(expectedState)

    })

  }) // ==== forwarding actions ====



  describe('undo', () => {

    it('should undo to the previous state', () => {

      const initialState: UndoxCounter = {
        history : [ init(), increment(), increment() ],
        index   : 2,
        present : 2
      }

      const undoAction = undo()

      const expectedState: UndoxCounter = {
        history : [ init(), increment(), increment() ],
        index   : 1,
        present : 1
      }

      const actualState = reducer(initialState, undoAction)
      expect(actualState).toEqual(expectedState)

    })

    it('should undo to the previous state if no payload is provided', () => {

      const initialState: UndoxCounter = {
        history : [ init(), increment(), increment() ],
        index   : 2,
        present : 2
      }

      const undoAction: UndoAction = { type: UndoxTypes.UNDO }

      const expectedState: UndoxCounter = {
        history : [ init(), increment(), increment() ],
        index   : 1,
        present : 1
      }

      const actualState = reducer(initialState, undoAction)
      expect(actualState).toEqual(expectedState)

    })

  }) // ==== undo ====



  describe('undo multiple', () => {

    it('should undo multiple to a past state', () => {

      const initialState: UndoxCounter = {
        history : [ init(), increment(), increment() ],
        index   : 2,
        present : 2
      }

      const undoAction = undo(2)

      const expectedState: UndoxCounter = {
        history : [ init(), increment(), increment() ],
        index   : 0,
        present : 0
      }

      const actualState = reducer(initialState, undoAction)
      expect(actualState).toEqual(expectedState)

    })

    it('should undo multiple greater than past', () => {

      const initialState: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 3,
        present : 3
      }

      const undoAction = undo(100)

      const expectedState: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 0,
        present : 0
      }

      const actualState = reducer(initialState, undoAction)
      expect(actualState).toEqual(expectedState)

    })

  }) // ==== undo multiple ====



  describe('redo', () => {

    it('should redo to the future state', () => {

      const initialState: UndoxCounter = {
        history : [ init(), increment(), decrement(), increment() ],
        index   : 1,
        present : 1
      }

      const redoAction = redo()

      const expectedState: UndoxCounter = {
        history : [ init(), increment(), decrement(), increment() ],
        index   : 2,
        present : 0
      }

      const actualState = reducer(initialState, redoAction)
      expect(actualState).toEqual(expectedState)

    })

    it('should redo to the future state if no payload is provided', () => {

      const initialState: UndoxCounter = {
        history : [ init(), increment(), decrement(), increment() ],
        index   : 1,
        present : 1
      }

      const redoAction: RedoAction = { type: UndoxTypes.REDO }

      const expectedState: UndoxCounter = {
        history : [ init(), increment(), decrement(), increment() ],
        index   : 2,
        present : 0
      }

      const actualState = reducer(initialState, redoAction)
      expect(actualState).toEqual(expectedState)

    })

  }) // ==== redo ====



  describe('redo multiple', () => {

    it('should redo multiple to a future state', () => {

      const initialState: UndoxCounter = {
        history : [ init(), increment(), increment() ],
        index   : 0,
        present : 0
      }

      const action = redo(2)

      const expectedState: UndoxCounter = {
        history : [ init(), increment(), increment() ],
        index   : 2,
        present : 2
      }

      const actualState = reducer(initialState, action)
      expect(actualState).toEqual(expectedState)
    })

    it('should redo multiple greater than future', () => {

      const initialState: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 0,
        present : 0
      }

      const redoAction = redo(100)

      const expectedState: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 3,
        present : 3
      }

      const actualState = reducer(initialState, redoAction)
      expect(actualState).toEqual(expectedState)

    })

  }) // ==== redo multiple ====



  describe('undo sequence', () => {

    it('should undo a sequence of states to a previous state', () => {

      const initialState: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 3,
        present : 3
      }


      const expectedState1: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 2,
        present : 2
      }
      const actualState1 = reducer(initialState, undo())
      expect(actualState1).toEqual(expectedState1)


      const expectedState2: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 1,
        present : 1
      }
      const actualState2 = reducer(actualState1, undo())
      expect(actualState2).toEqual(expectedState2)


      const expectedState3: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 0,
        present : 0
      }
      const actualState3 = reducer(actualState2, undo())
      expect(actualState3).toEqual(expectedState3)


      const expectedState4: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 0, // nothing to undo
        present : 0
      }
      const actualState4 = reducer(actualState3, undo())
      expect(actualState4).toEqual(expectedState4)

    })

  }) // ==== undo sequence ====



  describe('redo sequence', () => {

    it('should redo a sequence of states to a future state', () => {

      const initialState: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 0,
        present : 0
      }


      const expectedState1: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 1,
        present : 1
      }
      const actualState1 = reducer(initialState, redo())
      expect(actualState1).toEqual(expectedState1)


      const expectedState2: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 2,
        present : 2
      }
      const actualState2 = reducer(actualState1, redo())
      expect(actualState2).toEqual(expectedState2)


      const expectedState3: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 3,
        present : 3
      }
      const actualState3 = reducer(actualState2, redo())
      expect(actualState3).toEqual(expectedState3)


      const expectedState4: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 3, // nothing to redo
        present : 3
      }
      const actualState4 = reducer(actualState3, redo())
      expect(actualState4).toEqual(expectedState4)

    })

  }) // ==== redo sequence ====



  describe('undo/redo sequence', () => {

    it('should undo and redo a sequence of states to a correct state', () => {

      const initialState: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 0,
        present : 0
      }


      const expectedState1: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 1,
        present : 1
      }
      const actualState1 = reducer(initialState, redo())
      expect(actualState1).toEqual(expectedState1)


      const expectedState2: UndoxCounter = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 2,
        present : 2
      }
      const actualState2 = reducer(actualState1, redo())
      expect(actualState2).toEqual(expectedState2)


      const actualState3: UndoxCounter = reducer(actualState2, undo())
      expect(actualState3).toEqual(actualState1)


      const actualState4 = reducer(actualState3, redo())
      expect(actualState4).toEqual(actualState2)

    })

  }) // ==== undo/redo sequence ====



  describe('group actions', () => {

    it('should undo grouped actions', () => {

      const initialState: UndoxCounter = {
        history : [ init() ],
        index   : 0,
        present : 0
      }

      const groupAction = group([ increment(), increment() ])


      const expectedState1: UndoxCounter = {
        history : [ init(), [ increment(), increment() ] ],
        index   : 1,
        present : 2
      }
      const actualState1 = reducer(initialState, groupAction)
      expect(actualState1).toEqual(expectedState1)


      const expectedState2: UndoxCounter = {
        history : [ init(), [ increment(), increment() ] ],
        index   : 0,
        present : 0
      }
      const actualState2 = reducer(actualState1, undo())
      expect(actualState2).toEqual(expectedState2)

    })

    it('should redo grouped actions', () => {

      const initialState: UndoxCounter = {
        history : [ init(), [ increment(), increment(), decrement() ] ],
        index   : 0,
        present : 0 
      }

      const action = redo()

      const expectedState: UndoxCounter = {
        history : [ init(), [ increment(), increment(), decrement() ] ],
        index   : 1,
        present : 1
      }

      const actualState = reducer(initialState, action)
      expect(actualState).toEqual(expectedState)

    })

  }) // ==== group actions ====


})
