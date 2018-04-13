import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { undo, redo } from 'undox';

const mapDispatchToProps = (dispatch) => bindActionCreators({
    onUndo: () => undo(),
    onRedo: () => redo()
}, dispatch);

class Counter extends Component {
    render() {
        return (<div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <p>
          <button onClick={this.props.onUndo}>
            undo
          </button>
          {' '}
          <button onClick={this.props.onRedo}>
            redo
          </button>
        </p>
      </div>);
    }
}
export default connect(null, mapDispatchToProps)(Counter);
