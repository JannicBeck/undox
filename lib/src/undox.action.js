"use strict";
exports.__esModule = true;
var UndoxTypes;
(function (UndoxTypes) {
    UndoxTypes["UNDO"] = "undox/UNDO";
    UndoxTypes["REDO"] = "undox/REDO";
    UndoxTypes["GROUP"] = "undox/GROUP";
})(UndoxTypes = exports.UndoxTypes || (exports.UndoxTypes = {}));
/*
 * Action Creators
 */
exports.redo = function (nStates) {
    if (nStates === void 0) { nStates = 1; }
    return {
        type: UndoxTypes.REDO,
        payload: nStates
    };
};
exports.undo = function (nStates) {
    if (nStates === void 0) { nStates = 1; }
    return {
        type: UndoxTypes.UNDO,
        payload: nStates
    };
};
exports.group = function (actions) {
    return {
        type: UndoxTypes.GROUP,
        payload: actions
    };
};
