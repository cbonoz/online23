import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ZIP_FILE_NAME } from "../constants";


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
export async function encryptAndZipUserFiles(files, accessControlConditions) {
  await initClient()
  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
  const {ciphertext, dataToEncryptHash} = await LitJsSdk.zipAndEncryptFiles(
    files,
    {
      accessControlConditions,
      authSig,
      chain,
      readme: JSON.stringify({ name: 'metadata.json', description: 'Metadata for upload' })
    },
    litNodeClient,
  )

  // Create a new File object with the encrypted data
  // Rename file to data.{ext} with same extension
  // const blob = new Blob([ciphertext], { type: 'application/octet-stream' })
  const encryptedFile = new File([ciphertext], ZIP_FILE_NAME, { type: 'application/zip' })

  return {
    encryptedFile
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