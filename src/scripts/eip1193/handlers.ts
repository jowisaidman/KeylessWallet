// This file contain the handlers for the RPC calls made by the app to the provider
/*import { v4 as uuidv4 } from 'uuid';

// This functions awaits for the response in the popup through a message.
// It needs a random id generated when the message is sent to the popup to be able to await for the correct response
function awaitPopupResponse(id: string): Promise<any> {
    new Promise()
}*/

// Pops up a permission screen in the extension asking the user
// if it allows the dApp to connect to the account managed by
// the plug-in
//
// At the moment we manage only one account, in the future the
// plug-in will ask for all the accounts managed by it.
async function eth_requestAccounts(): Promise<any> {
  return [""];
  // return {"jsonrpc":"2.0","result":[ACCOUNT]};
}
