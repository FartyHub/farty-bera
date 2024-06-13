/* eslint-disable no-console */
import axios from 'axios';

const TG_API = `${import.meta.env.VITE_TG_API_URL}/api`;

const tgApiClient = axios.create({
  baseURL: TG_API,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_X_API_KEY,
  },
});

export async function getInvoice() {
  try {
    const { data } = await tgApiClient.get('/farty-claw/invoice');

    return {
      id: data?.id ?? '',
      url: data?.url ?? '',
    };
  } catch (error) {
    console.error(error);

    return {
      id: '',
      url: '',
    };
  }
}
