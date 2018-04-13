import { createStore } from 'redux'
import ReactDOM from 'react-dom';
import React from 'react'
import { Provider } from 'react-redux';

import { reducer } from './reducers'
import Counter from './components/Counter';
import Undo from './components/Undo';

const store = createStore(reducer)
const rootEl = document.getElementById('root')

const Root = () => {
  return (
    <div>
      <Counter />
      <Undo />
    </div>
  )
}

const render = () => ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  rootEl
)

render()
store.subscribe(render)
