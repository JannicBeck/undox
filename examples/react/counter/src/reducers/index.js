import { undox, createSelectors } from 'undox';
import { counter } from './counter';

export default undox(counter)
export const selectors = createSelectors(counter)