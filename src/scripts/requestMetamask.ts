(async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected account:', accounts[0]);
            
            const hexNonce = '0x' + parseInt("1002", 10).toString(16); 

            const message = JSON.stringify({
                type: 2,
                chainId: 11155111,
                maxPriorityFeePerGas: '0x3495d2cc',
                maxFeePerGas: '0x9fc5b6e3c',
                gasLimit: '0x55f0',
                to: '0x16CC7Bb7ae4D6f4A6EeA7dcE3F1492E4b70c5BB1',
                value: '0x38d7ea4c68000', // 0.001 ETH in wei, converted to hex
                data: '0x',
                accessList: [],
                nonce: hexNonce
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
