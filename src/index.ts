import HtmlDiff from './Diff';
import {BlockExpression} from './types';

type Options = {
    blocksExpression?: BlockExpression[];
};

const diff = (
    oldText: string,
    newText: string,
    {blocksExpression}: Options = {}
) => {
    const finder = new HtmlDiff(oldText, newText);
    if (blocksExpression) {
        blocksExpression.forEach(block => finder.addBlockExpression(block));
    }
    return finder.diff();
};

export default diff;
