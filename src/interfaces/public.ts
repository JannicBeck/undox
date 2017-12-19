import {
  UndoxAction,
  RedoAction,
  UndoAction
} from '../undox.action'


/**
 * A simple Redux Action
 */
export interface Action<T = any> {
  type     : T
  payload? : any
}

/**
 * The Reducer which is passed to the Undox Reducer.
 * 
 * @template S State object type.
 * @template A Action object type.
 * 
 */
export interface Reducer<S =  any, A extends Action = Action> {
  (state: S | undefined, action: A): S
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
  history : ReadonlyArray<(A | A[])>
  index   : Readonly<number>
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
