import fetch from 'node-fetch';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildApiBaseUrl = (blockHash) =>
  `https://blockstream.info/api/block/${blockHash}/txs`;

const fetchPaginatedTxs = async (apiUrl) => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`An error occured in fetching paginated data: `, err);
    return []; // TODO: Add Retries instead of returning empty list
  }
};

const fetchAllBlockTxs = async (blockHash, blockTxsCount) => {
  const apiBaseUrl = buildApiBaseUrl(blockHash);
  const uniqueTxsInBlock = new Set();
  const allTxs = [];

  let startIndex = 0;
  while (startIndex < blockTxsCount) {
    console.log('Fetching transactions with startIndex', startIndex);
    const paginatedTxs = await fetchPaginatedTxs(`${apiBaseUrl}/${startIndex}`);

    paginatedTxs.forEach((tx) => {
      uniqueTxsInBlock.add(tx.txid);
      allTxs.push({ txid: tx.txid, vin: tx.vin });
    });
    startIndex += 25;
    // await delay(2); // Uncomment if rate limiting errors come up
  }

  return { uniqueTxsInBlock, allTxs };
};

export { fetchAllBlockTxs };
