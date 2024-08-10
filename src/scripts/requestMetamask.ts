(async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected account:', accounts[0]);
            
            const toAddress = "0x16CC7Bb7ae4D6f4A6EeA7dcE3F1492E4b70c5BB1";
            const value = 0.001;

            const message = JSON.stringify({
                "type": 2,
                "chainId": 11155111,
                "maxPriorityFeePerGas": "882358428",
                "maxFeePerGas": "42874510220",
                "gasLimit": 22000,
                "to": toAddress,
                "value": `${value}`,
                "data":"0x",
                "accessList": []
            });

            console.log("wating for personal_sign");
            const signedMessage = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, accounts[0]]
            });

            console.log('Signed message:', signedMessage);

            window.postMessage({ type: 'SIGNED_MESSAGE', signedMessage }, '*');

        } catch (error) {
            console.error('User denied account access or signing', error);
        }
    } else {
        console.log('MetaMask is not installed');
    }
})();
