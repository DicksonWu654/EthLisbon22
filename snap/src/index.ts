import { OnTransactionHandler } from '@metamask/snap-types';
import { getInsights } from './insights';

/**
 * Handle an incoming transaction, and return any insights.
 *
 * @param args - The request handler args as object.
 * @param args.transaction - The transaction object.
 * @returns The transaction insights.
 */

// var old_address = "";

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  // console.log(old_address)
  // if (transaction.to != "0xa2423108AedC829C7DD5Adb08EE12A7745D60337") {
  //   if (transaction.to != old_address) {
  // old_address = (transaction.to).toString();
  return {
    insights: await getInsights(transaction),
  };
  //   }

  // } else {
  //   return ""
  // }

};
