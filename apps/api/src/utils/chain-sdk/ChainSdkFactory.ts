/* eslint-disable sonarjs/no-small-switch */
import { IChainSdk } from './IChainSdk';
import { EvmProvider } from './providers';

export enum ChainType {
  Evm = 'evm',
}

const chainSdkMap = new Map<ChainType, IChainSdk>();

export class ChainSdkFactory {
  static getChainSdk(chainType: ChainType): IChainSdk | null {
    if (!chainSdkMap.has(chainType)) {
      switch (chainType) {
        case ChainType.Evm:
          chainSdkMap.set(ChainType.Evm, new EvmProvider());
          break;
        default:
          return null;
      }
    }

    return chainSdkMap.get(chainType);
  }
}
