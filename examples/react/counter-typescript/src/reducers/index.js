import { undox, createSelectors } from 'undox';
import { counter } from './counter';
import { init } from '../actions';
export const reducer = undox(counter, init());
export const selectors = createSelectors(counter);
