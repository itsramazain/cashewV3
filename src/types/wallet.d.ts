declare module "@/utils/wallet" {
  export function connectWallet(): Promise<string>;
  export interface AddressAndBalance {
    address: string;
    balanceHBAR: number;
  }
  export function getAddressAndBalance(): Promise<AddressAndBalance>;
}
