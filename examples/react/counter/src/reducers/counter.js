import { INCREMENT, DECREMENT } from '../actions'

// the reducer which we want to add undo/redo functionality to
export const counter = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + 1
    case DECREMENT:
      return state - 1
    default:
      return state
  }
}
