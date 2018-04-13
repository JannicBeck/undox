import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux'
import { undo, redo } from 'undox';

type Props = ReturnType<typeof mapDispatchToProps>;

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  onUndo: () => undo(),
  onRedo: () => redo()
}, dispatch)

class Counter extends Component<Props> {

  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'space-around' }}>
        <p>
          <button onClick={this.props.onUndo}>
            undo
          </button>
          {' '}
          <button onClick={this.props.onRedo}>
            redo
          </button>
        </p>
      </div>
    )
  }

}

export default connect(null, mapDispatchToProps)(Counter);
