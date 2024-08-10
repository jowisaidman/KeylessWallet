let signedMessage: any = null;
(async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected account:', accounts[0]);

            const message = "This is a message to sign"; 

            signedMessage = await window.ethereum.request({
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
