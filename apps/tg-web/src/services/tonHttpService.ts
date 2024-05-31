/* eslint-disable no-console */
import axios from 'axios';

const TON_IO_API = `https://${import.meta.env.VITE_IS_MAINNET === 'true' ? '' : 'testnet.'}tonapi.io/v2`;

const tonIoApiClient = axios.create({
  baseURL: TON_IO_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getTransactions(transactionId: string) {
  try {
    const { data } = await tonIoApiClient.get(
      `blockchain/accounts/${transactionId}/transactions?limit=10&sort_order=desc`,
    );

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getTransaction(transactionId: string) {
  try {
    const { data } = await tonIoApiClient.get(
      `/blockchain/transactions/${transactionId}`,
    );

    return data;
  } catch (error) {
    console.error(error);
  }
}
