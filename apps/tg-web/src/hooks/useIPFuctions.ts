import IPinfoWrapper, { IPinfo } from 'node-ipinfo';
import { useEffect, useState } from 'react';

const ipInfoWrapper = new IPinfoWrapper(
  import.meta.env.VITE_IP_INFO_TOKEN ?? '',
);

export function useIPFunctions() {
  const [ip, setIp] = useState<string | undefined>();
  const [ipInfo, setIpInfo] = useState<IPinfo | undefined>();

  useEffect(() => {
    (async () => {
      if (ip) {
        const response = await ipInfoWrapper.lookupIp(ip);

        setIpInfo(response);
      }
    })();
  }, [ip]);

  useEffect(() => {
    (async () => {
      const response = await fetch('https://ifconfig.me/ip');
      setIp(await response.text());
    })();
  }, []);

  return {
    ip,
    ipInfo,
  };
}
