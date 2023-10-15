import * as LitJsSdk from '@lit-labs/lit-js-sdk';

const client = new LitJsSdk.LitNodeClient({
    litNetwork: 'cayenne',
})

export const initClient = async () => {
    await client.connect();
}

// const accessControlConditions = [
//     {
//       contractAddress: "",
//       standardContractType: "",
//       chain: "ethereum",
//       method: "eth_getBalance",
//       parameters: [":userAddress", "latest"],
//       returnValueTest: {
//         comparator: ">=",
//         value: "1000000000000", // 0.000001 ETH
//       },
//     },
//   ];
// https://developer.litprotocol.com/v3/sdk/access-control/encryption
  export async function encrypt(message) {
  
    const authSig = await client.checkAndSignAuthMessage({ chain })
    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions,
        authSig,
        chain: 'ethereum',
        dataToEncrypt: 'this is a secret message',
      },
      litNodeClient,
    );
  
    return {
      ciphertext,
      dataToEncryptHash,
    };
  }
  export async function decrypt(ciphertext , dataToEncryptHash, accessControlConditions) {
    if (!this.litNodeClient) {
      await this.connect()
    }
  
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'ethereum' })
    const decryptedString = LitJsSdk.decryptToString(
      {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig,
        chain: 'ethereum',
      },
      litNodeClient,
    );
    return { decryptedString }
  }