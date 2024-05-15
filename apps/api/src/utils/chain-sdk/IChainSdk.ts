export type VerifyMessageResult = {
  verified: boolean;
};

export type VerifyMessageOptions = {
  extraProps?: Record<string, any>;
  nodeUrl?: string;
};
export interface IChainSdk {
  getAddressFromPublicKey(publicKey: string, addressType?: unknown): string;

  getTaprootAddressByPublicKey?(publicKey: string): Promise<string>;

  getUserAddressOnTonChain?(publicKey: string): string;

  verifyMessage(
    message: string,
    signature: string,
    publicKey: string,
    options?: VerifyMessageOptions,
  ): Promise<boolean>;

  /**
   * EIP712 Verify Typed Data
   * @param message
   * @param signature
   * @param address
   */
  verifyTypedData?(
    message: string,
    signature: string,
    address: string,
  ): Promise<boolean>;
}
