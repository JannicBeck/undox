import React from 'react'
import { undo, redo } from 'undox'
import { connect } from 'react-redux'

import { selectors } from '../reducers/todos'

let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
  <p>
    <button onClick={onUndo} disabled={!canUndo}>
      Undo
    </button>
    <button onClick={onRedo} disabled={!canRedo}>
      Redo
    </button>
  </p>
)

const mapStateToProps = (state) => ({
  canUndo: selectors.getPastActions(state.todos).length > 0,
  canRedo: selectors.getFutureActions(state.todos).length > 0
})

const mapDispatchToProps = ({
  onUndo: () => undo(),
  onRedo: () => redo()
})

UndoRedo = connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo)

export default UndoRedo
