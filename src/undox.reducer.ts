import {
  Group,
  Undo,
  Redo,
  Delegate,
  CalculateState,
  DoNStatesExist
} from './interfaces/internal';

import {
  Action,
  Reducer,
  Comparator,
  UndoxState
} from './interfaces/public';

import {
  UndoxTypes,
  GroupAction,
  RedoAction,
  UndoAction,
  UndoxAction
} from './undox.action';


// helper used to flatten the history if grouped actions are in it
const flatten = <T> (x: (T | T[])[]) => [].concat(...x) as T[]

// actions can be an array of arrays because of grouped actions, so we flatten it first
const calculateState: CalculateState = (reducer, actions, state) => flatten(actions).reduce(reducer, state)

const getFutureActions = <S, A extends Action>(state: UndoxState<S, A>) => state.history.slice(state.index + 1)

const getPastActionsWithPresent = <S, A extends Action>(state: UndoxState<S, A>) => state.history.slice(0, state.index + 1)

const getPastActions = <S, A extends Action>(state: UndoxState<S, A>) => state.history.slice(0, state.index)

const getPresentState = <S, A extends Action>(state: UndoxState<S, A>) => state.present

export const createSelectors = <S, A extends Action>(reducer: Reducer<S, A>) => {

  return {
    getPastStates : (state: UndoxState<S, A>): S[] =>
      getPastActions(state) 
        .reduce(
          (states, a, i) =>
            Array.isArray(a)
              ? [ ...states, a.reduce(reducer, states[i - 1]) ]
              : [ ...states, reducer(states[i - 1], a) ]
          , [ ] as S[]
        ),

    getFutureStates : (state: UndoxState<S, A>): S[] =>
      getFutureActions(state)
        .reduce(
          (states, a, i) =>
            Array.isArray(a)
              ? [ ...states, a.reduce(reducer, states[i]) ]
              : [ ...states, reducer(states[i], a) ]
          , [ getPresentState(state) ]
        ).slice(1),

    getPresentState,
    getPastActions : (state: UndoxState<S, A>): A[] => flatten(getPastActions(state)),
    getPresentAction : (state: UndoxState<S, A>): A | A[] => state.history[state.index],
    getFutureActions : (state: UndoxState<S, A>): A[] => flatten(getFutureActions(state))
  }

}


const doNPastStatesExist   : DoNStatesExist = ({ history, index }, nStates) => index >= nStates
const doNFutureStatesExist : DoNStatesExist = ({ history, index }, nStates) => history.length - 1 - index >= nStates


const group: Group = (state, action, reducer, comparator) => {

  const presentState = getPresentState(state)
  const nextState = action.payload.reduce(reducer, state.present)

  if (comparator(presentState, nextState))
    return state

  return {
    history : [ ...getPastActionsWithPresent(state), action.payload ],
    index   : state.index + 1,
    present : nextState
  }

}


const undo: Undo = (reducer, state, { payload = 1 }) => {

  const nPastStatesExist = doNPastStatesExist(state, payload)
  const index = nPastStatesExist ? state.index - payload : 0

  const newState = {
    ...state,
    index
  }

  return {
    ...newState,
    present : calculateState(reducer, getPastActionsWithPresent(newState))
  }

}

const redo: Redo = (reducer, state, { payload = 1 }) => {

  const latestFuture = state.history.slice(state.index + 1, state.index + 1 + payload)

  return {
    ...state,
    index   : doNFutureStatesExist(state, payload) ? state.index + payload : state.history.length - 1, 
    present : calculateState(reducer, latestFuture, getPresentState(state))
  }

}


const delegate: Delegate = (state, action, reducer, comparator) => {

  const nextPresent = reducer(state.present, action)

  if (comparator(state.present, nextPresent))
    return state

  return {
    history : [ ...getPastActionsWithPresent(state), action ],
    index   : state.index + 1,
    present : nextPresent
  }

}


export const undox = <S, A extends Action>(
  reducer: Reducer<S, A>,
  initAction = { type: 'undox/INIT' } as A,
  comparator: Comparator<S> = (s1, s2) => s1 === s2
  ) => {

  const initialState: UndoxState<S, A> = {
    history : [ initAction ],
    present : reducer(undefined, initAction),
    index   : 0
  }

  return (state = initialState, action: UndoxAction<A>) => {

    switch (action.type) {

      case UndoxTypes.UNDO:
        return undo(reducer, state, action as UndoAction)

      case UndoxTypes.REDO:
        return redo(reducer, state, action as RedoAction)

      case UndoxTypes.GROUP:
        return group(state, action as GroupAction<A>, reducer, comparator)

      default:
        return delegate(state, action as A, reducer, comparator)

    }

  }

}
