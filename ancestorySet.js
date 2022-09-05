const buildTxParentGraph = (allTxs, uniqueTxsInBlock) => {
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

const dfs = (txParentGraph, txId, ancestorySet) => {
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
      const parentAncestors = dfs(txParentGraph, parentTx, ancestorySet); // Calculate ancestors of parentTx
      ancestors += parentAncestors + 1; // Parent is also an ancestor
    }
  }
  ancestorySet[txId] = ancestors;
};

const buildAncestorySet = (txParentGraph, uniqueTxsInBlock) => {
  const ancestorySet = {};

  for (const txId of uniqueTxsInBlock) {
    if (ancestorySet[txId] !== undefined) {
      // Already calculated ancestors of parentTx, dont do it again
      continue;
    }
    dfs(txParentGraph, txId, ancestorySet);
  }

  return ancestorySet;
};

const getTopTxByAncestorySize = (ancestorySet, filterSize) => {
  const allTxsSortedByAncestorySize = Object.entries(ancestorySet).sort(
    (first, second) => {
      const firstAncestorySetSize = first[1],
        secondAncestorySetSize = second[1];
      return secondAncestorySetSize - firstAncestorySetSize;
    }
  );
  return allTxsSortedByAncestorySize.slice(0, filterSize);
};

export { buildTxParentGraph, buildAncestorySet, getTopTxByAncestorySize };
