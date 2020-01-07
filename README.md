# <img src='https://github.com/JannicBeck/undox/blob/master/logo/logo.png?raw=true' height='30'> Undox

Redux implementation of Undo/Redo based on storing actions instead of states.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/JannicBeck/undox/blob/master/LICENSE)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-Typescript-blue.svg)](https://www.typescriptlang.org/)

## Install
### npm
```
npm install undox --save
yarn add undox --save
```
## Usage
```js
import { undox, createSelectors, UndoxTypes } from 'undox'

// the reducer which we want to add undo/redo functionality to
const counter = (state = 0, action) => action.type === 'INCREMENT' ? state + 1 : state

// wrap the counter reducer with undox
const reducer = undox(counter)

store.dispatch({ type: 'INCREMENT' })
state.present // 1

store.dispatch({ type: UndoxTypes.UNDO })
state.present // 0

store.dispatch({ type: UndoxTypes.REDO })
state.present // 1

// state now looks like this
{
  history: [ { type: 'undox/INIT' }, type: 'INCREMENT', type: 'INCREMENT' ],
  index: 1,
  present: 1
}

// the library provides some basic selectors
const selectors = createSelectors(counter)

selectors.getPresentState(state) // 1
selectors.getPresentAction(state) // { type: 'INCREMENT' }
selectors.getPastStates(state)    // [ 0 ]
selectors.getPastActions(state)   // [ { type: 'undox/INIT' } ]
selectors.getFutureStates(state)  // [ 2 ]
selectors.getFutureActions(state) // { type: 'INCREMENT' }
```

Actions are stored in an array named history. The index points at the present action in the history array.

Past actions are left to the present and future actions on the right.

## Comparison
It really just boils down to if your state is fat and your actions are thin or your state is thin and your actions are fat.

The most popular and used library to add undo/redo functionality to redux is without a doubt [redux-undo](https://github.com/omnidan/redux-undo).

It stores whole states instead of actions. This is great for small states and fat actions, but does not scale well if the state tree grows and especially if state is persisted.

Undox takes a different approach and only stores actions, which has advantages as well as disadvantages.

### Advantages
- Takes up less space inside localStorage for thin actions and fat states
- Better performance for thin actions and fat states
- A complete history for free!

### Disadvantages
- Takes up more space inside localStorage for fat actions and thin states
- Worse performance for fat actions and thin states
- Less feature rich than redux-undo

## API

### Undo
There are two recommended ways to create an undo action:

1. Use the action creators
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
If the payload is greater than the length of the past/future, all actions will be undone/redone.

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

### initAction (optional)
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
