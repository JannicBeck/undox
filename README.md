# <img src='https://github.com/JannicBeck/undox/blob/master/logo/logo.png?raw=true' height='30'> Undox

Redux/Ngrx implementation of Undo/Redo based on an action history

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/JannicBeck/undox/blob/master/LICENSE)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-Typescript-blue.svg)](https://www.typescriptlang.org/)

## Installation
### npm
```
npm install undox --save
```

### yarn
```
yarn add undox --save
```

## Usage
```js
import { undox, createSelectors, UndoxTypes } from 'undox'

// the reducer which we want to add undo/redo functionality to
// it has to be a pure function without side effects!
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    default:
      return state
  }
}

// wrap the counter reducer with undox
// it works just like the counter reducer, except
// it has additional UNDO/REDO/GROUP actions
const reducer = undox(counter)

// get the selectors to query the new state
const selectors = createSelectors(counter)

store.dispatch({ type: 'INCREMENT' })
selectors.getPresentState(state) // 1

store.dispatch({ type: 'INCREMENT' })
selectors.getPresentState(state) // 2

store.dispatch({ type: UndoxTypes.UNDO })
selectors.getPresentState(state) // 1

store.dispatch({ type: UndoxTypes.REDO })
selectors.getPresentState(state) // 2

import { undo } from 'undox'

store.dispatch(undo())
selectors.getPresentState(state) // 1

// your state now looks like this
state: {
  history: [ { type: 'undox/INIT' }, type: 'INCREMENT', type: 'INCREMENT' ],
  index: 1,
  present: 1
}

selectors.getPresentAction(state) // { type: 'INCREMENT' }
selectors.getPastStates(state)    // [ 0 ]
selectors.getPastActions(state)   // [ { type: 'undox/INIT' } ]
selectors.getFutureStates(state)  // [ 2 ]
selectors.getFutureActions(state) // { type: 'INCREMENT' }

// increment twice with one action by grouping
store.disptach({ type: UndoxTypes.GROUP, payload: [ { type: 'INCREMENT' }, { type: 'INCREMENT' } ] })
selectors.getPresentState(state) // 3

// grouped actions will be undone in one step
store.disptach(undo())
selectors.getPresentState(state) // 1

```

As you see only the actions are stored inside a history array and an index points to the present action.

Past actions will appear left of the present and future actions on the right of the present.

To retrieve the actual state you use the selector ``getPresentState``.

### Selectors
The selectors are the contract between this library and your code. They won't change and guarantee
that I won't break your app when adding features to this library.

#### Custom Selectors
Of course you can create your own selectors, but make sure you use the existing ones as an input for your new ones e.g. using [reselect](https://github.com/reactjs/reselect):
```js
createSelector(getPastStates, pastStates => pastStates.filter(x => x > 1))
createSelector(getPastActions, getPresentAction, (pastActions, presentAction) => [...pastActions, presentAction])

```

### Undo
There are two recommended ways to create an undo action:
1. Use the action creator
```js
import { undo, redo, group } from 'undox'
const undoAction = undo()
const redoAction = redo()
const groupAction = group()
```
2. Use the UndoxTypes
```js
import { UndoxTypes } from 'undox'
const undoAction = { type: UndoxTypes.UNDO }
const redoAction = { type: UndoxTypes.REDO }
const groupAction = { type: UndoxTypes.GROUP }
```

The payload of the undo/redo action corresponds to the number of steps to undo/redo, it defaults to 1.
If the payload is greater than (past/future).length, all actions will be undone/redone.

```js
state: {
  history : [ { type: 'undox/INIT' }, { type: 'INCREMENT' }, { type: 'INCREMENT' }, { type: 'INCREMENT' } ],
  index   : 3,
  present : 3
}

// if the argument/payload for undo is greater than the past it will just undo all actions
store.dispatch(undo(100))

{
  history : [ { type: 'undox/INIT' }, { type: 'INCREMENT' }, { type: 'INCREMENT' }, { type: 'INCREMENT' } ],
  index   : 0
  present : 0
}

// same with redo
store.dispatch(redo(100))

{
  history : [ { type: 'undox/INIT' }, { type: 'INCREMENT' }, { type: 'INCREMENT' }, { type: 'INCREMENT' } ],
  index   : 3,
  present : 3
}

```

### Group
The group action is a sepcial undox action. It will group the actions given in the payload, and store them as an array inside the history. Undo/Redo will then undo/redo them as one single step.
```js
import { group } from 'undox'
const incrementTwice = group({ type: 'INCREMENT' }, { type: 'INCREMENT' })

store.dispatch(incrementTwice)

{
  history : [ { type: 'undox/INIT' }, [ { type: 'INCREMENT' }, { type: 'INCREMENT' } ] ],
  index   : 1,
  present : 2
}

store.dispatch(undo(1))

{
  history : [ { type: 'undox/INIT' }, [ { type: 'INCREMENT' }, { type: 'INCREMENT' } ] ],
  index   : 0,
  present : 0
}
```

## Parameters

### initAction
You may have wondered where `{ type: 'undox/INIT' }` inside the history comes from.
It is the default init action with which your reducer is called when it is initialized.

```js
const reducer = undox(counter, { type: 'MY_CUSTOM_INIT' })

{
  history : [ { type: 'MY_CUSTOM_INIT' } ],
  index   : 0,
  present : 0
}
```

### Comparator (optional)
The third argument of `undox` is a comparator function which compares two states in order to detect state changes.

- If it evaluates to true, the action history is not updated and the state is returned.
- If it evaluates to false, the action history is updated and the new state is returned.
- The default comparator uses strict equality `(s1, s2) => s1 === s2`.
- To add every action to the history one would provide the comparator `(s1, s2) => false`.

```js
reducer(counter, initAction, (s1, s2) => false)
```

## Motivation
**TL:DR**
It really just boils down to if your state is fat and your actions are thin or your state is thin and your actions are fat.

- Use [redux-undo](https://github.com/omnidan/redux-undo) if your state is thin and your actions are fat.
- Use this library if your state is fat and your actions are thin and you want maximum benefits for that.

The most popular and used library to add undo/redo functionality to redux is without a doubt [redux-undo](https://github.com/omnidan/redux-undo).

It stores the whole state instead of actions. While this is great if we got a lean state and fat actions, it does not scale well if our state tree grows and especially if we want to persist our state.

My use case:
- I have a big state and very lean actions, since I synchronize clients by sending actions over websockets.
- I'm storing state on the client side inside the localStorage and reproduce the state from there if the user refreshes the page or comes back later.
- I'm storing the state on the server side inside redis from where I send it to other services.
- I need full undo/redo functionality without limit for over 500 actions.
- I need a full history of all actions (not just only states).

Why redux-undo didn't fit my use case:
- With over 500 actions the corresponding 500 states stored inside localStorage would take up way too much space.
- My App slowed down significantly after 50+ actions because the states are rehydrated from localStorage and therefore do not share any memory.
- I couldn't reproduce the actions from the states (we can always reproduce the states from the actions but it doesn't work the other way around aka what action triggered that state change)

This library instead only stores actions, which results in some nice advantages, but also some disadvantages, depending on your use case.

### Advantages
- Takes up less space inside localStorage for thin actions and fat states
- Better performance for thin actions and fat states
- A complete history for free!
- Type safety (completely written in TypeScript)
- Smaller in size than redux-undo
- Works really well, if you need to persist your state

### Disadvantages
- Takes up more space inside localStorage for fat actions and thin states
- Worse performance for fat actions and thin states
- Less feature rich than redux-undo
