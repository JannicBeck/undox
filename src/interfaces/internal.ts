import {
  Action,
  UndoxState,
  Reducer,
  Comparator,
  Limit,
} from './public';

import {
  UndoAction,
  RedoAction,
  GroupAction
} from '../undox.action';


export interface DoNStatesExist {
  <S, A extends Action>(state: UndoxState<S, A>, nStates: number): boolean
}

export interface CalculateState {
  <S, A extends Action>(reducer: Reducer<S, A>, actions: (A | A[])[], state: S): S
}

export interface Undo {
  <S, A extends Action>(reducer: Reducer<S, A>, state: UndoxState<S, A>, action: UndoAction, limit: Limit): UndoxState<S, A>
}

export interface Redo {
  <S, A extends Action>(reducer: Reducer<S, A>, state: UndoxState<S, A>, action: RedoAction, limit: Limit): UndoxState<S, A>
}

export interface Group {
  <S, A extends Action>(state: UndoxState<S, A>, action: GroupAction<A>, reducer: Reducer<S, A>, comparator: Comparator<S>, limit: Limit): UndoxState<S, A>
}

export interface Delegate {
  <S, A extends Action>(state: UndoxState<S, A>, action: A, reducer: Reducer<S, A>, comparator: Comparator<S>, limit: Limit): UndoxState<S, A>
}
