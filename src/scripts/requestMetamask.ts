
(async () => {
    console.log("PASAAAAAAAA123123123");
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected account:', accounts[0]);
            // Do something with the connected account
        } catch (error) {
            console.error('User denied account access', error);
        }
    } else {
        console.log('MetaMask is not installed');
    }
})();