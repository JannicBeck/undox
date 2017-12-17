import {
  Action,
  UndoxState,
  Reducer,
  Comparator,
} from './public';

import { UndoAction, RedoAction, GroupAction } from '../undox.action';


export interface DoNStatesExist {
  <S, A extends Action>(state: UndoxState<S, A>, nStates: number): boolean
}

export interface CalculateState {
  <S, A extends Action>(reducer: Reducer<S, A>, actions: (A | A[])[]): S
}

export interface Undo {
  <S, A extends Action>(state: UndoxState<S, A>, action: UndoAction): UndoxState<S, A>
}

export interface Redo {
  <S, A extends Action>(state: UndoxState<S, A>, action: RedoAction): UndoxState<S, A>
}

export interface Group {
  <S, A extends Action>(state: UndoxState<S, A>, action: GroupAction<A>, reducer: Reducer<S, A>, comparator: Comparator<S>): UndoxState<S, A>
}

export interface Delegate {
  <S, A extends Action>(state: UndoxState<S, A>, action: A, reducer: Reducer<S, A>, comparator: Comparator<S>): UndoxState<S, A>
}
