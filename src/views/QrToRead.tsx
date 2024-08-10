import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
// import { sendToChain } from '../utils/transactions'
import { QrReader } from "../components/QrReader";
import { changeScreen, Screen } from "../utils/navigation";


export default () => {
  async function cancel() {
    await changeScreen(Screen.Welcome);
  }

  function onScanSignature(signature: string) {
    console.log("scanned signature");
  }

    return (
        <div className="flex flex-col items-center gap-5 grow pb-5 h-full justify-between">
           <div className="text-center my-2">
           <div className="text-primary font-bold text-2xl">
                Scan the signed transaction
           </div>
           <div className="text-secondary">Scan the QR code showed in the offline wallet to send the transaction to chain</div>
           </div>

          <QrReader readInterval={500} onSuccess={onScanSignature} />

            <div className="flex items-center space-x-3 items-end mb-1">
               <Button
                 onClick={cancel}
                 variant="primary"
                 centered
                 className="px-10"
                 size="lg"
               > Cancel
               </Button>
           </div>
        </div>
    )
}
