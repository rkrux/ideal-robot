import { fetchAllBlockTxs } from './fetcher.js';
import {
  buildTxParentGraph,
  buildAncestorySet,
  getTopTxByAncestorySize,
} from './ancestorySet.js';

const BLOCK_HASH =
  '000000000000000000076c036ff5119e5a5a74df77abf64203473364509f7732'; // Block Height: 680000
const BLOCK_TXS_COUNT = 2875;

const { allTxs, uniqueTxsInBlock } = await fetchAllBlockTxs(
  BLOCK_HASH,
  BLOCK_TXS_COUNT
);
const txParentGraph = buildTxParentGraph(allTxs, uniqueTxsInBlock);
const ancestorySet = buildAncestorySet(txParentGraph, uniqueTxsInBlock);
const top10TxByAncestorySize = getTopTxByAncestorySize(ancestorySet, 10);

console.log('Top 10 transactions with the largest ancestory sets: ');
top10TxByAncestorySize.forEach((entry) => {
  console.log(`TransactionId: ${entry[0]}, Ancestory Set Size: ${entry[1]}`);
});
