import fetch from 'node-fetch';

const BLOCK_HASH =
  '000000000000000000076c036ff5119e5a5a74df77abf64203473364509f7732'; // 680000
const BLOCK_TXS_COUNT = 2875;
const API_BASE_URL = `https://blockstream.info/api/block/${BLOCK_HASH}/txs`;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchPaginatedTxs = async (startIndex) => {
  console.log('Fetching transactions with startIndex', startIndex);
  try {
    const response = await fetch(`${API_BASE_URL}/${startIndex}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`An error occured in fetching paginated data: `, err);
    return []; // TODO: Retry?
  }
};

const uniqueTxsInBlock = new Set();
const allTxs = [];

// Fetch all data
let startIndex = 0;
while (startIndex < BLOCK_TXS_COUNT) {
  const paginatedTxs = await fetchPaginatedTxs(startIndex);

  paginatedTxs.forEach((tx) => {
    uniqueTxsInBlock.add(tx.txid);
    allTxs.push({ txid: tx.txid, vin: tx.vin });
  });
  startIndex += 25;
  await delay(3); // To avoid rate limiting
}

export { uniqueTxsInBlock, allTxs };
