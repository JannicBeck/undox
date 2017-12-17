"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var undox_action_1 = require("./undox.action");
// helper used to flatten the history if grouped actions are in it
var flatten = function (x) { return [].concat.apply([], x); };
// actions can be an array of arrays because of grouped actions, so we flatten it first
var calculateState = function (reducer, actions) { return flatten(actions).reduce(reducer, undefined); };
var getFutureActions = function (state) { return state.history.slice(state.index + 1); };
var getPastActions = function (state) { return state.history.slice(0, state.index + 1); };
var createGetPresentState = function (reducer) {
    return function (state) { return calculateState(reducer, getPastActions(state)); };
};
exports.createSelectors = function (reducer) {
    var getPresentState = createGetPresentState(reducer);
    return {
        getPastStates: function (state) {
            return state.history.slice(0, state.index)
                .reduce(function (states, a, i) {
                return Array.isArray(a)
                    ? states.concat([a.reduce(reducer, states[i])]) : states.concat([reducer(states[i], a)]);
            }, []);
        },
        getFutureStates: function (state) {
            return getFutureActions(state)
                .reduce(function (states, a, i) {
                var previousState = states[i - 1] ? states[i - 1] : getPresentState(state);
                return Array.isArray(a)
                    ? states.concat([a.reduce(reducer, previousState)]) : states.concat([reducer(previousState, a)]);
            }, []);
        },
        getPresentState: getPresentState,
        getPastActions: function (state) { return flatten(state.history.slice(0, state.index)); },
        getPresentAction: function (state) { return state.history[state.index]; },
        getFutureActions: function (state) { return flatten(getFutureActions(state)); }
    };
};
var doNPastStatesExit = function (_a, nStates) {
    var history = _a.history, index = _a.index;
    return index >= nStates;
};
var doNFutureStatesExit = function (_a, nStates) {
    var history = _a.history, index = _a.index;
    return history.length - 1 - index >= nStates;
};
var group = function (state, action, reducer, comparator) {
    var presentState = createGetPresentState(reducer)(state);
    if (comparator(presentState, flatten(action.payload)
        .reduce(reducer, presentState))) {
        return state;
    }
    return {
        history: getPastActions(state).concat([action.payload]),
        index: state.index + 1
    };
};
var undo = function (state, _a) {
    var _b = _a.payload, payload = _b === void 0 ? 1 : _b;
    return __assign({}, state, { index: doNPastStatesExit(state, payload) ? state.index - payload : 0 });
};
var redo = function (state, _a) {
    var _b = _a.payload, payload = _b === void 0 ? 1 : _b;
    return __assign({}, state, { index: doNFutureStatesExit(state, payload) ? state.index + payload : state.history.length - 1 });
};
var delegate = function (state, action, reducer, comparator) {
    var presentState = createGetPresentState(reducer)(state);
    if (comparator(presentState, reducer(presentState, action))) {
        return state;
    }
    return {
        history: getPastActions(state).concat([action]),
        index: state.index + 1
    };
};
exports.undox = function (reducer, initAction, comparator) {
    if (initAction === void 0) { initAction = { type: 'INIT' }; }
    if (comparator === void 0) { comparator = function (s1, s2) { return s1 === s2; }; }
    var initialState = {
        history: [initAction],
        index: 0
    };
    return function (state, action) {
        if (state === void 0) { state = initialState; }
        switch (action.type) {
            case undox_action_1.UndoxTypes.UNDO:
                return undo(state, action);
            case undox_action_1.UndoxTypes.REDO:
                return redo(state, action);
            case undox_action_1.UndoxTypes.GROUP:
                return group(state, action, reducer, comparator);
            default:
                return delegate(state, action, reducer, comparator);
        }
    };
};
