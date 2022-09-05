import { fetchAllBlockTxs } from './fetcher.js';
import {
  buildTxParentGraph,
  buildAncestorySet,
  getTopTxByAncestorySize,
} from './ancestorySet.js';

const { allTxs, uniqueTxsInBlock } = await fetchAllBlockTxs();
const txParentGraph = buildTxParentGraph(allTxs, uniqueTxsInBlock);
const ancestorySet = buildAncestorySet(txParentGraph, uniqueTxsInBlock);
const top10TxByAncestorySize = getTopTxByAncestorySize(ancestorySet, 10);

console.log('Top 10 transactions with the largest ancestory sets: ');
top10TxByAncestorySize.forEach((entry) => {
  console.log(`TransactionId: ${entry[0]}, Ancestory Size: ${entry[1]}`);
});
