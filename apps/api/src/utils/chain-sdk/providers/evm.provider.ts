import { verifyMessage, getAddress, verifyTypedData } from 'ethers';

import { IChainSdk } from '../IChainSdk';
import { toLowerCase } from '../utils';

export class EvmProvider implements IChainSdk {
  async verifyMessage(
    message: string,
    signature: string,
    address: string,
  ): Promise<boolean> {
    const addressFromSig = verifyMessage(message, signature);

    return toLowerCase(address) === toLowerCase(addressFromSig);
  }

  getAddressFromPublicKey(publicKey: string): string {
    return getAddress(publicKey);
  }

  async verifyTypedData(
    message: string,
    signature: string,
    address: string,
  ): Promise<boolean> {
    const messageJson = JSON.parse(message);

    const primaryType = messageJson.primaryType;
    const address2 = verifyTypedData(
      messageJson.domain,
      { [primaryType]: messageJson.types[primaryType] },
      messageJson.message,
      signature,
    );

    return toLowerCase(address) === toLowerCase(address2);
  }
}
