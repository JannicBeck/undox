# <img src='https://github.com/JannicBeck/undox/blob/master/logo/logo.png?raw=true' height='30'> undox

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
import { undox } from 'undox'

const undoxMap = undox(reducer, initAction)
const undoxReducer = undoxMap.reducer
const undoxSelectors = undoxMap.selectors

```
`reducer` is the reducer which you want to add undo and redo functionality to and `initAction` is the action which initializes your `reducer`.

`undoxReducer` is the higher order reducer, which works just like your `reducer` except that the `state` now looks like this:

```js
const state = {
  history : [ { type: 'INIT_ACTION' }, { type: 'PAST_ACTION' }, { type: 'CURRENT_ACTION' }, { type: 'FUTURE_ACTION' } ],
  index   : 2
}

undoxSelectors.getPresentState(state)
```

As you see only the actions are stored inside an array and an index points to the present action.

Past actions will appear left of the present and future actions on the right side of the present.

You retrieve the actual state via a selector (see the section on selectors).

## Motivation
**TL:DR**
It really just boils down to if your state is fat and your actions are thin or your state is thin and your actions are fat.

- Use [redux-undo](https://github.com/omnidan/redux-undo) if your state is thin and your actions are fat.
- Use this library if your state is fat and your actions are thin and you want maximum performance for that.
- Use [ngrx-undoable](https://github.com/JannicBeck/ngrx-undoable) if you want something in between with a nicer API than this library. (only present state is stored)

The most popular and used library to add undo/redo functionality to redux is without a doubt [redux-undo](https://github.com/omnidan/redux-undo).

It stores the whole state instead of actions. While this is great if we got a lean state and fat actions, it does not scale well if our state tree grows.

My use case:
- I have a big state and very lean actions, since I synchronize clients by sending actions over websockets.
- I'm storing state on the client side inside the localStorage and reproduce the state from there if the user refreshes the page or comes back later.
- I'm storing the state on the server side inside redis from where I send it to other services.
- I need full undo/redo functionality without limit for over 500 actions.
- I need a full history of all actions (not just only states).

Why redux-undo didn't fit my use case:
- With over 500 actions the corresponding 500 states stored inside localStorage would take up way too much space.
- The App slowed down significantly after 50+ actions.
- I couldn't reproduce the actions from the states (we can always reproduce the states from the actions but it doesn't work the other way around aka what action triggered that state change)

This library instead only stores actions, which results in some nice advantages, but also some disadvantages depending on your use case.

### Advantages
- Takes up less space inside localStorage for thin actions and fat states
- Better performance for thin actions and fat states
- A complete history for free!
- Type safety (completely written in TypeScript)
- Smaller in size than redux-undo

### Disadvantages
- Takes up more space inside localStorage for fat actions and thin states
- Worse performance for fat actions and thin states
- Less feature rich than redux-undo

## Examples

Lets look at the popular [counter](https://github.com/reactjs/redux/tree/master/examples/counter) example.

```js
const undoxCounter = undox(counter, { type: 'INIT' })

const reducer = undoxCounter.reducer
const selectors = undoxCounter.selectors

const initialState = undoxCounter(undefined, {})

{
  history : [ { type: 'INIT' } ],
  index   : 0
}

const state1 = undoxCounter(initialState, { type: 'INCREMENT' })

{
  history : [ { type: 'INIT' }, { type: 'INCREMENT' } ],
  index   : 1
}

const state2 = undoxCounter(state1, { type: 'DECREMENT' })

{
  history : [ { type: 'INIT' }, { type: 'INCREMENT' }, { type: 'DECREMENT' } ],
  index   : 2
}
```

### Selectors
`const undoxSelectors = undox(counter).selectors`

These are your selectors to query the undox state, use them!!

The selectors are the contract between this library and your code. They won't change and guarantee
that I won't break your app when adding features to this library.

#### State Selectors
```js
undoxSelectors.getPastStates(state)

// An Array of State objects that represent the past in the order: [oldest, latest]
[ 0, 1 ]
```

```js
undoxSelectors.getPresentState(state)

// The current State
2
```

```js
undoxSelectors.getFutureStates(state)

// An Array of State objects that represent the future in the order: [latest, oldest]
[ 3, 4 ]
```

#### Action Selectors
```js
undoxSelectors.getPastActions(state)

// An Array of Action objects that represent the past in the order: [oldest, latest]
[ { type: 'INIT' }, { type: 'INCREMENT' } ]
```
```js
undoxSelectors.getLatestAction(state)

// The latest Action
{ type: 'INCREMENT' }
```

```js
undoxSelectors.getFutureActions(state)

// An Array of Action objects that represent the future in the order: [latest, oldest]
[ { type: 'INCREMENT' }, { type: 'INCREMENT' } ]
```

#### Custom Selectors
Of course you can create your own selectors, but make sure you use the existing ones as an input for your new ones f.e. using [reselect](https://github.com/reactjs/reselect):
```js
createSelector(getPastStates, pastStates => pastStates.filter(x => x > 1))
```

### Undo
There are two recommended ways to create an undo action:
1. Use the action creator
```js
import { undo } from 'undox'
const undoAction = undo()
```
2. Use the UndoxTypes
```js
import { UndoxTypes } from 'undox'
const undoAction = { type: UndoxTypes.UNDO }
```

```js
const initialState = {
  history : [ { type: 'INIT' }, { type: 'INCREMENT' }, { type: 'DECREMENT' }, { type: 'INCREMENT' } ],
  index   : 3
}

undoxCounter(initialState, undoAction)

{
  history : [ { type: 'INIT' }, { type: 'INCREMENT' }, { type: 'DECREMENT' }, { type: 'INCREMENT' } ],
  index   : 2
}
```
The payload of the undo action corresponds to the number of steps to undo, it defaults to 1.
If the payload is greater than past.length, all actions will be undone.

```js
undoxCounter(initialState, undo(100))

{
  history : [ { type: 'INIT' }, { type: 'INCREMENT' }, { type: 'DECREMENT' }, { type: 'INCREMENT' } ],
  index   : 0
}
```

### Redo
Redo works pretty much analogous to undo:
```js
import { redo } from 'undox'

const initialState = {
  history : [ { type: 'INIT' }, { type: 'INCREMENT' }, { type: 'DECREMENT' } ],
  index   : 1
}

undoxCounter(initialState, redo())

{
  history : [ { type: 'INIT' }, { type: 'INCREMENT' }, { type: 'DECREMENT' } ],
  index   : 2
}
```

### Group
The group action is a sepcial undox action. It will group the actions given in the payload, and store them as an array inside the history. Undo will then undo them as one single step.
```js
import { group } from 'undox'
const incrementTwice = group({ type: 'INCREMENT' }, { type: 'INCREMENT' })
```
```js
import { UndoxTypes } from 'undox'
const incrementTwice = { type: UndoxTypes.GROUP, payload: [ { type: 'INCREMENT' }, { type: 'INCREMENT' } ] }
```

```js
const state1 = undoxCounter(initialState, incrementTwice)

{
  history : [ { type: 'INIT' }, [ { type: 'INCREMENT' }, { type: 'INCREMENT' } ] ],
  index   : 1
}

const state2 = undoxCounter(state1, undo(1))

{
  history : [ { type: 'INIT' }, [ { type: 'INCREMENT' }, { type: 'INCREMENT' } ] ],
  index   : 0
}
```

## Parameters

### initAction
You may have wondered where `{ type: 'INIT' }` inside the history comes from.
Its the initAction with which your reducer is called when it is initialized.

```js
const undoxCounter = undox(counter, { type: 'MY_CUSTOM_INIT' })

{
  history    : [ { type: 'MY_CUSTOM_INIT' } ],
  index : 0
}
```

### Comparator (optional)
The third argument of `undox` is a comparator function which compares two states in order to detect state changes.

- If it evaluates to true, the action history is not updated and the state is returned.
- If it evaluates to false, the action history is updated and the new state is returned.
- The default comparator uses strict equality `(s1, s2) => s1 === s2`.
- To add every action to the history one would provide the comparator `(s1, s2) => false`.

```js
undox(counter, initAction, (s1, s2) => false)
```





