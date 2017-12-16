import {
  Action,
  UndoxState,
  Reducer,
  Comparator,
  Selectors,
  UndoxReducer
} from './public'
import { UndoAction, RedoAction, GroupAction } from '../undox.action';


export interface UndoxReducer {
  <S, A extends Action>(reducer: Reducer<S, A>, initAction: A, comparator: Comparator<S>) : UndoxReducer<S, A>
}


export interface AddToHistory {
  <S, A extends Action>(undox: UndoxState<S, A>, actions: (A | A[])[], reducer: Reducer<S, A>, comparator: Comparator<S>): UndoxState<S, A>
}


export interface UpdateHistory {
  <S, A extends Action>(undox: UndoxState<S, A>, action: A, comparator: Comparator<S>): UndoxState<S, A>
}


export interface DoNStatesExist {
  <S, A extends Action>(state: UndoxState<S, A>, nStates: number): boolean
}


export interface CalculateState {
  <S, A extends Action>(reducer: Reducer<S, A>, actions: (A | A[])[]): S
}


export interface CreateSelectors {
  <S, A extends Action>(reducer: Reducer<S, A>): Selectors<S, A>
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
