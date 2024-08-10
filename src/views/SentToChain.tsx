import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Tabs, Tab } from '../components/Tabs';
import Loading from '../components/Loading';

export default () => {
    const [transactionSent, setTransactionSent] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => { setTransactionSent(true); }, 3000);
    }, []);

    function ok() {
        chrome.storage.sync.set({ source: "none" })
    }

    return (
        <div className="flex flex-col items-center gap-5 grow mt-5 pb-5 h-full justify-between">
           <div className="text-primary font-bold text-2xl my-2">
                Sending transaction to chain...
           </div>
            {
                transactionSent
                    ? (
                        <div className="text-center my-2">
                            <div className="text-primary font-bold text-3xl">
                                Transaction sent
                           </div>
                           <div className="text-secondary">View on the scanner</div>
                       </div>
                    ) : <Loading />
            }
            <div className="flex items-center space-x-3 items-end mb-1">
               <Button
                 onClick={ok}
                 variant="primary"
                 centered
                 className="px-10"
                 size="lg"
                 disabled={!transactionSent}
               > Done
               </Button>
           </div>
        </div>
    )
}
