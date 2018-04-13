import React, { Component } from 'react';
import { selectors } from '../reducers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { increment, decrement } from '../actions';

const mapStateToProps = state => {
    return {
        presentState: selectors.getPresentState(state),
        pastStates: selectors.getPastStates(state),
        futureStates: selectors.getFutureStates(state),
        presentAction: selectors.getPresentAction(state),
        futureActions: selectors.getFutureActions(state),
        pastActions: selectors.getPastActions(state)
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    onIncrement: increment,
    onDecrement: decrement
}, dispatch)

class Counter extends Component {
  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <p>
          <button onClick={this.props.onIncrement}>
            +
          </button>
          {' '}
          <button onClick={this.props.onDecrement}>
            -
          </button>
        </p>
        <div>
          <h3>Past States</h3>
          <ul>{this.props.pastStates.map((s, i) => <li key={i}>{s}</li>)}</ul>
          <h3>Present State</h3>
          {this.props.presentState}
          <h3>Future States</h3>
          <ul>{this.props.futureStates.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
        <div>
          <h3>Past Actions</h3>
          <ul>{this.props.pastActions.map((a, i) => <li key={i}>{a.type}</li>)}</ul>
          <h3>Present Action</h3>
          {this.props.presentAction.type}
          <h3>Future Actions</h3>
          <ul>{this.props.futureActions.map((a, i) => <li key={i}>{a.type}</li>)}</ul>
        </div>
      </div>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
