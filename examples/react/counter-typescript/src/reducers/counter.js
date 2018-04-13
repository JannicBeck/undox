import { Count } from '../actions';
export const counter = (state = 0, action) => {
    switch (action.type) {
        case Count.INCREMENT:
            return state + 1;
        case Count.DECREMENT:
            return state - 1;
        default:
            return state;
    }
};
