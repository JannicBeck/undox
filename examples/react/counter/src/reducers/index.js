import { undox, createSelectors } from 'undox';
import { counter } from './counter';

export const reducer = undox(counter)
export const selectors = createSelectors(counter)
