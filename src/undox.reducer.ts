import { UndoxTypes, GroupAction, RedoAction, UndoAction, UndoxAction } from './undox.action';
import { Group, Undo, Redo, Delegate, CalculateState, CreateSelectors, DoNStatesExist } from './interfaces/internal';
import { Action, Reducer, Comparator, UndoxState, Undox } from './interfaces/public';


// helper used to flatten the history if grouped actions are in it
const flatten = <T> (x: (T | T[])[]) => [].concat(...x) as T[]


// actions can be an array of arrays because of grouped actions, so we flatten it first
const calculateState: CalculateState = (reducer, actions) => flatten(actions).reduce(reducer, undefined)


const getFutureActions = ({ history, index }) => history.slice(index + 1)
const getPastActions   = ({ history, index }) => history.slice(0, index + 1)


const createSelectors: CreateSelectors = reducer => {

  return {
    getPastStates    : state => state.history.slice(0, state.index).map((a, i) => calculateState(reducer, state.history.slice(0, i + 1))),
    getPresentState  : state => calculateState(reducer, getPastActions(state)),
    getFutureStates  : state => getFutureActions(state).map((a, i) => calculateState(reducer, state.history.slice(0, state.index + 1 + i + 1))),
    getPastActions   : state => flatten(getPastActions(state)),
    getLatestAction  : state => flatten([state.history[state.index]])[0],
    getFutureActions : state => flatten(getFutureActions(state))
  }

}


const doNPastStatesExit   : DoNStatesExist = ({ history, index }, nStates) => index >= nStates
const doNFutureStatesExit : DoNStatesExist = ({ history, index }, nStates) => history.length - 1 - index >= nStates


const group: Group = (state, action, reducer, comparator) => {

  if (comparator(calculateState(reducer, getPastActions(state)), flatten(action.payload).reduce(reducer, calculateState(reducer, getPastActions(state))))) {
    return state
  }

  return {
    history : [ ...getPastActions(state), action.payload ],
    index   : state.index + 1,
  }

}


const undo: Undo = (state, action) => {

  return {
    ...state,
    index : doNPastStatesExit(state, action.payload) ? state.index - action.payload : 0
  }

}

const redo: Redo = (state, action) => {

  return {
    ...state,
    index : doNFutureStatesExit(state, action.payload) ? state.index + action.payload : state.index
  }

}


const delegate: Delegate = (state, action, reducer, comparator) => {

  if (comparator(calculateState(reducer, getPastActions(state)), reducer(calculateState(reducer, getPastActions(state)), action as any))) {
    return state
  }

  return {
    history : [ ...getPastActions(state), action ],
    index   : state.index + 1,
  }

}


const createUndoxReducer = <S, A extends Action>(reducer: Reducer<S, A>, initAction: A, comparator: Comparator<S>) => {

  const initialState: UndoxState<S, A> = {
    history : [ initAction ],
    index   : 0
  }

  return (state = initialState, action: UndoxAction<A>) => {

    switch (action.type) {

      case UndoxTypes.UNDO:
        return undo(state, action as UndoAction)

      case UndoxTypes.REDO:
        return redo(state, action as RedoAction)

      case UndoxTypes.GROUP:
        return group(state, action as GroupAction<A>, reducer, comparator)

      default:
        return delegate(state, action as A, reducer, comparator)

    }

  }

}


export const undox: Undox = (reducer, initAction, comparator = (s1, s2) => s1 === s2) => {

  return {
    reducer   : createUndoxReducer(reducer, initAction, comparator),
    selectors : createSelectors(reducer)
  }

}
