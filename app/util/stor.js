// import { Web3Storage } from "web3.storage";
import axios from 'axios'
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js"; // webpack 4
import { encryptUserFile } from "./litHelper";

const API_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY;

function getAccessToken() {
  return API_KEY;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

export async function uploadFiles(files, metadata, accessControlConditions) {
  // Encrypt the file bytes data
  const file = files[0];
  const { zipBlob, encryptedSymmetricKey, symmetricKey } = await encryptUserFile(file, accessControlConditions || [])
  // Create a new File object with the encrypted data
  const encryptedFile = new File([zipBlob], file.name);
  const encryptedFiles = [encryptedFile];
  // Upload the encrypted file

  const newFiles = [...encryptedFiles]
  if (metadata) {
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    const metaFile = new File([blob], 'metadata.json')
    newFiles.push(metaFile)
  }
  const client = makeStorageClient();
  const cid = await client.put(newFiles);
  console.log("stored files with cid:", cid);
  return cid;
}

export const getMetadata = (baseUrl) => {
  const url = `${baseUrl}/metadata.json`;
  return axios.get(url);
};

export async function retrieveFiles(cid) {
  const client = makeStorageClient();
  const res = await client.get(cid);
  console.log(`Got a response! [${res.status}] ${res.statusText}`);
  if (!res.ok) {
    throw new Error(`failed to get ${cid}`);
  }

  // request succeeded! do something with the response object here...

  return res;
}