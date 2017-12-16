import 'jest';
import { undox } from '../src/undox.reducer';
import { UndoxState } from '../src/interfaces/public';
import { UndoxTypes, undo, redo, group } from '../src/undox.action';
import { counter, init, increment, decrement, CounterAction } from './helpers/counter';


describe('The undox.reducer', () => {

  const reducer = undox(counter, init()).reducer  
  type UndoxCounter = UndoxState<number, CounterAction>

  describe('initial state', () => {

    it('should use the initAction', () => {

      const initAction = init()

      const expectedState = {
        history : [ initAction ],
        index   : 0
      }

      const actualState = reducer(undefined, init())
      expect(actualState).toEqual(expectedState)

    })

  }) // ==== initial state ====


  describe('forwarding actions', () => {

    it('should call the given reducer', () => {

      const initialState = undefined

      const incrementAction = increment()

      const expectedState = {
        history : [ init(), incrementAction ],
        index   : 1
      }

      const actualState = reducer(initialState, incrementAction)
      expect(actualState).toEqual(expectedState)

    })

    it('should call the given reducer', () => {

      const initialState = undefined
      const decrementAction = decrement()

      const expectedState = {
        history : [ init(), decrementAction ],
        index   : 1
      }

      const actualState = reducer(initialState, decrementAction)
      expect(actualState).toEqual(expectedState)

    })

    it('should wipe the future when an action is forwarded', () => {

      const initialState = {
        history : [ init(), increment(), increment(), increment(), increment() ],
        index   : 1
      }

      const expectedState = {
        history : [ init(), increment(), decrement() ],
        index   : 2
      }

      const actualState = reducer(initialState, decrement())
      expect(actualState).toEqual(expectedState)

    })

  }) // ==== forwarding actions ====



  describe('undo', () => {

    it('should undo to the previous state', () => {

      const initialState = {
        history : [ init(), increment(), increment() ],
        index   : 2
      }

      const undoAction = undo()

      const expectedState = {
        history : [ init(), increment(), increment() ],
        index   : 1
      }

      const actualState = reducer(initialState, undoAction)
      expect(actualState).toEqual(expectedState)
    })

  }) // ==== undo ====



  describe('undo multiple', () => {

    it('should undo multiple to a past state', () => {

      const initialState = {
        history : [ init(), increment(), increment() ],
        index   : 2
      }

      const undoAction = undo(2)

      const expectedState = {
        history : [ init(), increment(), increment() ],
        index   : 0
      }

      const actualState = reducer(initialState, undoAction)
      expect(actualState).toEqual(expectedState)

    })

    it('should undo multiple greater than past', () => {

      const initialState = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 3
      }

      const undoAction = undo(100)

      const expectedState = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 0
      }

      const actualState = reducer(initialState, undoAction)
      expect(actualState).toEqual(expectedState)

    })

  }) // ==== undo multiple ====



  describe('redo', () => {

    it('should redo to the future state', () => {

      const initialState = {
        history : [ init(), increment(), decrement(), increment() ],
        index   : 1
      }

      const action = redo()

      const expectedState = {
        history : [ init(), increment(), decrement(), increment() ],
        index   : 2
      }

      const actualState = reducer(initialState, action)
      expect(actualState).toEqual(expectedState)

    })

  }) // ==== redo ====



  describe('redo multiple', () => {

    it('should redo multiple to a future state', () => {

      const initialState = {
        history : [ init(), increment(), increment() ],
        index   : 0
      }

      const action = redo(2)

      const expectedState = {
        history : [ init(), increment(), increment() ],
        index   : 2
      }

      const actualState = reducer(initialState, action)
      expect(actualState).toEqual(expectedState)
    })

  }) // ==== redo multiple ====



  describe('undo sequence', () => {

    it('should undo a sequence of states to a previous state', () => {

      const initialState = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 3
      }


      const expectedState1 = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 2
      }
      const actualState1 = reducer(initialState, undo())
      expect(actualState1).toEqual(expectedState1)


      const expectedState2 = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 1
      }
      const actualState2 = reducer(actualState1, undo())
      expect(actualState2).toEqual(expectedState2)


      const expectedState3 = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 0
      }
      const actualState3 = reducer(actualState2, undo())
      expect(actualState3).toEqual(expectedState3)


      const expectedState4 ={
        history : [ init(), increment(), increment(), increment() ],
        index   : 0 // nothing to undo
      }
      const actualState4 = reducer(actualState3, undo())
      expect(actualState4).toEqual(expectedState4)

    })

  }) // ==== undo sequence ====



  describe('redo sequence', () => {

    it('should redo a sequence of states to a future state', () => {

      const initialState = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 0
      }


      const expectedState1 = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 1
      }
      const actualState1 = reducer(initialState, redo())
      expect(actualState1).toEqual(expectedState1)


      const expectedState2 = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 2
      }
      const actualState2 = reducer(actualState1, redo())
      expect(actualState2).toEqual(expectedState2)


      const expectedState3 = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 3
      }
      const actualState3 = reducer(actualState2, redo())
      expect(actualState3).toEqual(expectedState3)


      const expectedState4 = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 3 // nothing to redo
      }
      const actualState4 = reducer(actualState3, redo())
      expect(actualState4).toEqual(expectedState4)

    })

  }) // ==== redo sequence ====



  describe('undo/redo sequence', () => {

    it('should undo and redo a sequence of states to a correct state', () => {

      const initialState = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 0
      }


      const expectedState1 = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 1
      }
      const actualState1 = reducer(initialState, redo())
      expect(actualState1).toEqual(expectedState1)


      const expectedState2 = {
        history : [ init(), increment(), increment(), increment() ],
        index   : 2
      }
      const actualState2 = reducer(actualState1, redo())
      expect(actualState2).toEqual(expectedState2)


      const actualState3 = reducer(actualState2, undo())
      expect(actualState3).toEqual(actualState1)


      const actualState4 = reducer(actualState3, redo())
      expect(actualState4).toEqual(actualState2)

    })

  }) // ==== undo/redo sequence ====



  describe('group actions', () => {

    it('should undo grouped actions', () => {

      const initialState = {
        history : [ init() ],
        index   : 0
      }

      const groupAction = group(increment(), increment())


      const expectedState1 = {
        history : [ init(), [ increment(), increment() ] ],
        index   : 1
      }
      const actualState1 = reducer(initialState, groupAction)
      expect(actualState1).toEqual(expectedState1)


      const expectedState2 = {
        history : [ init(), [ increment(), increment() ] ],
        index   : 0
      }
      const actualState2 = reducer(actualState1, undo())
      expect(actualState2).toEqual(expectedState2)

    })

    it('should redo grouped actions', () => {

      const initialState = {
        history    : [ init(), [ increment(), increment(), decrement() ] ],
        index : 0
      }

      const action = redo()

      const expectedState = {
        history : [ init(), [ increment(), increment(), decrement() ] ],
        index   : 1
      }

      const actualState = reducer(initialState, action)
      expect(actualState).toEqual(expectedState)

    })

  }) // ==== group actions ====


})
