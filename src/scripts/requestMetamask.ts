let signedMessage: any = null;

(async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected account:', accounts[0]);

            // Define the message or transaction to be signed
            const message = "This is a message to sign";  // Replace with your actual message

            // Request MetaMask to sign the message
            signedMessage = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, accounts[0]]
            });

            console.log('Signed message:', signedMessage);

            // You can now use `signedMessage` later in your code

        } catch (error) {
            console.error('User denied account access or signing', error);
        }
    } else {
        console.log('MetaMask is not installed');
    }
})();

// Example usage later in the script
export function useSignedMessage() {
    if (signedMessage) {
        console.log('Using signed message:', signedMessage);
        return signedMessage
        // Your code to use the signed message
    } else {
        console.log('No signed message available');
        return "pelado"
    }
}