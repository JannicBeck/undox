import {
  UndoxAction,
  RedoAction,
  UndoAction
} from '../undox.action'


/**
 * A simple Redux Action
 */
export interface Action {
  type      : string
  payload?  : any
}


/**
 * The Reducer which is passed to the Undox Reducer.
 * 
 * @template S State object type.
 * @template A Action object type.
 * 
 */
export interface Reducer<S, A extends Action> {
  (state: Readonly<S>, action: A): S
}


/**
 * The State object type of the undox reducer
 * 
 * @template S State object type.
 * @template A Action object type.
 * 
 * @member history An Array of Action objects that represent the history in the order: [...past, present, ...future]
 * @member index The index which represents the present
 * 
 */
export interface UndoxState<S, A extends Action> {
  history : (A | A[])[]
  index   : number
}


// action should be `UndoxAction | A` but this ruins type safety inside the undox reducer
/**
 * The undox higher order reducer, wraps the provided reducer and
 * creates a history from it.
 * 
 * @template S State object type.
 * @template A Action object type.
 * 
 */
export interface Undox {
  <S, A extends Action>(reducer: Reducer<S, A>, initAction?: A, comparator?: Comparator<S>): UndoxMap<S, A>
}


export interface UndoxMap<S, A extends Action> {
  reducer   : UndoxReducer<S, A>
  selectors : Selectors<S, A>
}


export interface UndoxReducer<S, A extends Action> {
  (state: UndoxState<S, A>, action: UndoxAction<A>): UndoxState<S, A>
}


/**
 * 
 * A function which compares two states in order to detect state changes.
 * If it evaluates to true, the action history is not updated and the state is returned.
 * If it evaluates to false, the action history is updated and the new state is returned.
 * The default comparator uses strict equality (s1, s2) => s1 === s2.
 * To add every action to the history one would provide the comparatar (s1, s2) => false.
 * 
 * @template S State object type.
 * 
 */
export type Comparator<S> = (s1: S, s2: S) => boolean


/**
 * Selectors which can be used to select get the states from Undox.
 * 
 * @member getPastStates An Array of State objects that represent the past in the order: [oldest, latest]
 * @member getPresentState The current State
 * @member getFutureStates An Array of State objects that represent the future in the order: [latest, oldest]
 * 
 * @member getPastActions An Array of Action objects that represent the past in the order: [oldest, latest]
 * @member getPresentAction The current Action
 * @member getFutureActions An Array of Action objects that represent the future in the order: [latest, oldest]
 *  
 * @template S State object type.
 * @template A Action object type.
 * 
 */
export interface Selectors<S, A extends Action> {
  getPastStates    : (state: UndoxState<S, A>) => S[]
  getPresentState  : (state: UndoxState<S, A>) => S
  getFutureStates  : (state: UndoxState<S, A>) => S[]
  getPastActions   : (state: UndoxState<S, A>) => A[]
  getLatestAction  : (state: UndoxState<S, A>) => A
  getFutureActions : (state: UndoxState<S, A>) => A[]
}
