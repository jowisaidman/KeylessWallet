import React, { useContext } from 'react';
import { Button } from '../components/Button';
import { Tabs, Tab } from '../components/Tabs';
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import { getTransaction } from '../utils/transaction';
import { WalletContext, IWalletContext } from "../context/context";
import { changeScreen, Screen } from "../utils/navigation";

export default () => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

    async function back() {
        await changeScreen(Screen.Welcome);
    }

    async function send() {
        const addressTo = (document.getElementById('address_to') as HTMLInputElement)?.value;
        const valueToSend = (document.getElementById('value_to_send') as HTMLInputElement)?.value;
        const transaction = getTransaction(addressTo, Number(valueToSend));
        transactionContext.setData(transaction);
        await changeScreen(Screen.QrToSign);

    }

    return (
        <div className="flex flex-col items-center gap-5 grow px-5 h-full">
            <div className="text-primary font-bold text-2xl my-2">
                Send transaction
            </div>
            <div>
                <div className="text-primary font-bold text-2xl">Account</div>
                <div className="text-secondary">{ walletContext.currentAccount!.address }</div>
            </div>
            <form className="max-w-sm mx-auto w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Send to:</label>
                <input type="text" id="address_to" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" required />
                <br/>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter the amount:</label>
                <input type="number" id="value_to_send" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" required />
            </form>

            <div className="flex items-center space-x-3 items-end mt-auto mb-6">
               <Button
                 onClick={back}
                 variant="secondary"
                 className="px-10"
                 centered
                 size="lg"
                > Back
               </Button>
               <Button
                 onClick={send}
                 variant="primary"
                 centered
                 className="px-10"
                 size="lg"
               > Sign
               </Button>
           </div>
       </div>
    )
}
