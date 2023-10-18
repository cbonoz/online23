import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ACTIVE_CHAIN } from "../constants";


let litNodeClient;
const chain = 'mumbai'

export const initClient = async () => {
  if (!litNodeClient) {
    litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: 'cayenne',
    })
    await litNodeClient.connect();
  }
}

// https://developer.litprotocol.com/v3/sdk/access-control/encryption
// https://github.com/LIT-Protocol/lit-js-sdk/blob/main/api_docs.md#encryptfileandzipwithmetadata
export async function encryptUserFile(file, accessControlConditions) {
  await initClient()
  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
  const zipBlob = await LitJsSdk.encryptFileAndZipWithMetadata(
    {
      accessControlConditions,
      authSig,
      chain,
      file,
      litNodeClient,
      readme: JSON.stringify({name: file.name, description: file.description})
    }
  )

  return {
    zipBlob,
  };
}

// https://github.com/LIT-Protocol/lit-js-sdk/blob/main/api_docs.md#decryptfileandzipwithmetadata
export async function decryptUserFile(file, accessControlConditions) {
  initClient()
  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
  const { decryptedFile, metadata } = await LitJsSdk.decryptFileAndZipWithMetadata(
    {
      accessControlConditions,
      file,
      authSig,
      chain,
      litNodeClient
    });
  return { decryptedFile, metadata }
}