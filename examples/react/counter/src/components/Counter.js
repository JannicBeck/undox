import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { selectors } from '../reducers'

class Counter extends Component {

  render() {
    const { value, onIncrement, onDecrement, onUndo, onRedo } = this.props

    const presentState = selectors.getPresentState(value)
    const pastStates = selectors.getPastStates(value).map((s, i) => <li key={i}>{s}</li>)
    const futureStates = selectors.getFutureStates(value).map((s, i) => <li key={i}>{s}</li>)

    const presentAction = selectors.getPresentAction(value)
    const pastActions = selectors.getPastActions(value).map((a, i) => <li key={i}>{a.type}</li>)
    const futureActions = selectors.getFutureActions(value).map((a, i) => <li key={i}>{a.type}</li>)

    return (
      <div style={{display: 'flex', justifyContent: 'space-around' }}>
        <p>
          <button onClick={onIncrement}>
            +
          </button>
          {' '}
          <button onClick={onDecrement}>
            -
          </button>
          {' '}
          <button onClick={onUndo}>
            Undo
          </button>
          {' '}
          <button onClick={onRedo}>
            Redo
          </button>
        </p>
        <div>
          <h3>Past States</h3>
          <ul>{pastStates}</ul>
          <h3>Present State</h3>
          {presentState}
          <h3>Future States</h3>
          <ul>{futureStates}</ul>
        </div>
        <div>
          <h3>Past Actions</h3>
          <ul>{pastActions}</ul>
          <h3>Present Action</h3>
          {presentAction.type}
          <h3>Future Actions</h3>
          <ul>{futureActions}</ul>
        </div>
      </div>
    )
  }

}

Counter.propTypes = {
  value: PropTypes.object.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
}

export default Counter
