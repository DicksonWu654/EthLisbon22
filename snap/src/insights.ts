
import {
  add0x,
  bytesToHex,
  hasProperty,
  isObject,
  remove0x,
} from '@metamask/utils';
// import { encode } from '@metamask/abi-utils';
import { encodePacked } from '@metamask/abi-utils';
import { address } from '@metamask/abi-utils/dist/parsers';

import { ethers } from "ethers";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * As an example, get transaction insights by looking at the transaction data
 * and attempting to decode it.
 *
 * @param transaction - The transaction to get insights for.
 * @returns The transaction insights.
 */
export async function getInsights(transaction: Record<string, unknown>) {
  // console.log(transaction);

  // console.log(window)
  // console.log(window.wallet)
  // return "hi"

  console.log(transaction)

  // return ""


  if (transaction.to != "0xa2423108AedC829C7DD5Adb08EE12A7745D60337") {
    console.log("bears")
    const accounts = wallet.request({
      method: 'eth_requestAccounts',
    }).then(() => { console.log("beavers") })

    const connected_wallet = await wallet.request({
      method: 'eth_call',
      params: [{ from: null, to: "0xa2423108AedC829C7DD5Adb08EE12A7745D60337", data: encodePacked(['address'], [transaction.from]) }, "latest"],
    });


    const connected_wallet = "0xE5c9CB0Eba301464FfA327c6622942FD64D4CDd0"


    if (transaction.to != connected_wallet) {
      // console.log(connected_wallet)
      // console.log(transaction.from)
      // console.log("1")

      let ABI = ["function queue(address payable _to, uint256 _value, bytes memory _data)"];
      let iface = new ethers.utils.Interface(ABI);
      const send_data = iface.encodeFunctionData("queue", [[transaction.to, transaction.value, transaction.data]])


      const transactionParameters = {
        nonce: '0x00', // ignored by MetaMask
        gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
        gas: '0x2710', // customizable by user during MetaMask confirmation.
        to: connected_wallet, // Required except during contract publications.
        from: transaction.from, // must match user's active address.
        value: transaction.value, // Only required to send ether to the recipient from the initiating external account.
        data: send_data, // Optional, but used for defining smart contract creation and interaction.
        chainId: '0x5', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };
      // console.log(2)
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = await wallet.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      sleep(10000)

      // console.log(3)

      return {
        type: 'Unknown transaction',
      };
    } else {
      console.log(connected_wallet)
      return {
        type: 'Unknown transaction',
      };
    }
  } else {
    return {
      type: 'Unknown transaction',
    };
  }




}

/**
 * The ABI decoder returns certain which are not JSON serializable. This
 * function converts them to strings.
 *
 * @param value - The value to convert.
 * @returns The converted value.
 */
function normalize4ByteValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalize4ByteValue);
  }

  if (value instanceof Uint8Array) {
    return bytesToHex(value);
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  return value;
}

// The API endpoint to get a list of functions by 4 byte signature.
const API_ENDPOINT =
  'https://www.4byte.directory/api/v1/signatures/?hex_signature=';

/* eslint-disable camelcase */
type FourByteSignature = {
  id: number;
  created_at: string;
  text_signature: string;
  hex_signature: string;
  bytes_signature: string;
};
/* eslint-enable camelcase */

/**
 * Gets the function name(s) for the given 4 byte signature.
 *
 * @param signature - The 4 byte signature to get the function name(s) for. This
 * should be a hex string prefixed with '0x'.
 * @returns The function name(s) for the given 4 byte signature, or an empty
 * array if none are found.
 */
async function getFunctionsBySignature(
  signature: `0x${string}`,
): Promise<string[]> {
  const response = await fetch(`${API_ENDPOINT}${signature}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Unable to fetch functions for signature "${signature}": ${response.status} ${response.statusText}.`,
    );
  }

  // The response is an array of objects, each with a "text_signature" property.
  const { results } = (await response.json()) as {
    results: FourByteSignature[];
  };

  // The "text_signature" property is a string like "transfer(address,uint256)",
  // which is what we want. They are sorted by oldest first.
  // We pick the oldest because it's probably the result that we want.
  return results
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((result) => result.text_signature);
}
