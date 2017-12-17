import { UndoxTypes, GroupAction, RedoAction, UndoAction, UndoxAction } from './undox.action';
import { Group, Undo, Redo, Delegate, CalculateState, DoNStatesExist } from './interfaces/internal';
import { Action, Reducer, Comparator, UndoxState } from './interfaces/public';

// helper used to flatten the history if grouped actions are in it
const flatten = <T> (x: (T | T[])[]) => [].concat(...x) as T[]

// actions can be an array of arrays because of grouped actions, so we flatten it first
const calculateState: CalculateState = (reducer, actions) => flatten(actions).reduce(reducer, undefined)

const getFutureActions = <S, A extends Action>(state: UndoxState<S, A>) => state.history.slice(state.index + 1)

const getPastActions = <S, A extends Action>(state: UndoxState<S, A>) => state.history.slice(0, state.index + 1)

const createGetPresentState = <S, A extends Action>(reducer: Reducer<S, A>) =>
  (state: UndoxState<S, A>) => calculateState(reducer, getPastActions(state))


export const createSelectors = <S, A extends Action>(reducer: Reducer<S, A>) => {

  const getPresentState = createGetPresentState(reducer)

  return {
    getPastStates : (state: UndoxState<S, A>): S[] =>
      state.history.slice(0, state.index)
        .reduce(
          (states, a, i) =>
            Array.isArray(a)
              ? [ ...states, a.reduce(reducer, states[i]) ]
              : [ ...states, reducer(states[i], a) ]
          , [ ] as S[]
        ),

    getFutureStates : (state: UndoxState<S, A>): S[] =>
      getFutureActions(state)
        .reduce(
          (states, a, i) => {
            const previousState = states[i - 1] ? states[i - 1] : getPresentState(state)
            return Array.isArray(a)
              ? [ ...states, a.reduce(reducer, previousState) ]
              : [ ...states, reducer(previousState, a) ]
          }, [ ] as S[]
        ),

    getPresentState,
    getPastActions  : (state: UndoxState<S, A>): A[] => flatten(state.history.slice(0, state.index)),
    getPresentAction : (state: UndoxState<S, A>): A | A[] => state.history[state.index],
    getFutureActions : (state: UndoxState<S, A>): A[] => flatten(getFutureActions(state))
  }

}


const doNPastStatesExit   : DoNStatesExist = ({ history, index }, nStates) => index >= nStates
const doNFutureStatesExit : DoNStatesExist = ({ history, index }, nStates) => history.length - 1 - index >= nStates


const group: Group = (state, action, reducer, comparator) => {

  const presentState = createGetPresentState(reducer)(state)

  if (
    comparator(
      presentState,
      flatten(action.payload)
        .reduce(reducer, presentState)
    )
  ) {
    return state
  }

  return {
    history : [ ...getPastActions(state), action.payload ],
    index   : state.index + 1,
  }

}


const undo: Undo = (state, { payload = 1 }) => {

  return {
    ...state,
    index : doNPastStatesExit(state, payload) ? state.index - payload : 0
  }

}

const redo: Redo = (state, { payload = 1 }) => {

  return {
    ...state,
    index : doNFutureStatesExit(state, payload) ? state.index + payload : state.history.length - 1
  }

}


const delegate: Delegate = (state, action, reducer, comparator) => {

  const presentState = createGetPresentState(reducer)(state)

  if (comparator(presentState, reducer(presentState, action))) {
    return state
  }

  return {
    history : [ ...getPastActions(state), action ],
    index   : state.index + 1,
  }

}


export const undox = <S, A extends Action>(
  reducer: Reducer<S, A>,
  initAction = { type: 'INIT' } as A,
  comparator: Comparator<S> = (s1, s2) => s1 === s2
  ) => {

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
