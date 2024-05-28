/* eslint-disable @typescript-eslint/no-useless-constructor */
export class AccountNotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}
