export var Count;
(function (Count) {
    Count["INCREMENT"] = "INCREMENT_COUNTER";
    Count["DECREMENT"] = "DECREMENT_COUNTER";
    Count["INIT"] = "INIT_COUNTER";
})(Count || (Count = {}));
export const increment = () => {
    return { type: Count.INCREMENT };
};
export const decrement = () => {
    return { type: Count.DECREMENT };
};
export const init = () => {
    return { type: Count.INIT };
};
