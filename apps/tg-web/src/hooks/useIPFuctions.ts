/* eslint-disable no-console */
import axios from 'axios';
import { useEffect, useState } from 'react';

export function useIPFunctions() {
  const [ip, setIp] = useState<string>();
  const [region, setRegion] = useState<string>();

  useEffect(() => {
    (async () => {
      if (ip) {
        try {
          const response = await fetch(`https://freeipapi.com/api/json/${ip}`);
          const data = await response.json();
          setRegion(data.continentCode);
        } catch (error) {
          console.log('error', error);
        }
      }
    })();
  }, [ip]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('https://ifconfig.me/ip');
        setIp(response.data);
      } catch (error) {
        console.log('error', error);
      }
    })();
  }, []);

  return {
    ip,
    region,
  };
}
