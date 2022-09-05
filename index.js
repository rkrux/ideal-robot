import { allTxs, uniqueTxsInBlock } from './fetcher.js';

const buildGraph = (allTxs, uniqueTxsInBlock) => {
  const graph = {};

  allTxs.forEach((currentTx) => {
    currentTx.vin.forEach((parentTx) => {
      const isParentTxInBlock = uniqueTxsInBlock.has(parentTx.txid);
      if (isParentTxInBlock === true) {
        const parents = graph[currentTx.txid] ?? new Set();
        parents.add(parentTx.txid);
        graph[currentTx.txid] = parents;
      }
    });
  });

  return graph;
};
const txParentGraph = buildGraph(allTxs, uniqueTxsInBlock);

// DFS for all tx, build ancestorySet for all tx
const ancestorySet = {};
const dfs = (txId) => {
  if (txParentGraph[txId] === undefined) {
    // Tx has no parents in the same block
    return 0;
  }

  let ancestors = 0;
  for (const parentTx of txParentGraph[txId]) {
    if (ancestorySet[parentTx] !== undefined) {
      // Already calculated ancestors of parentTx, dont do it again
      ancestors += ancestorySet[parentTx] + 1; // Parent is also an ancestor
    } else {
      const parentAncestors = dfs(parentTx); // Calculate ancestors of parentTx
      ancestors += parentAncestors + 1; // Parent is also an ancestor
    }
  }
  ancestorySet[txId] = ancestors;
};
for (const txId of uniqueTxsInBlock) {
  if (ancestorySet[txId] !== undefined) {
    // Already calculated ancestors of parentTx, dont do it again
    continue;
  }
  dfs(txId);
}
// console.log('ancestorySet: ', ancestorySet);

// Sort ancestorySet based on count of ancestors
const allTxsSortedByAncestorySize = Object.entries(ancestorySet).sort(
  (first, second) => {
    const firstAncestorySetSize = first[1],
      secondAncestorySetSize = second[1];
    return secondAncestorySetSize - firstAncestorySetSize;
  }
);
// console.log(allTxsSortedByAncestorySize);

// Pick top 10
console.log('Top 10 transactions with the largest ancestory sets: ');
allTxsSortedByAncestorySize.slice(0, 10).forEach((entry) => {
  console.log(`TransactionId: ${entry[0]}, Ancestory Size: ${entry[1]}`);
});
