import { ethers } from "ethers";
import { DATA_CONTRACT } from "./metadata";

export async function deployContract(signer, cid, assertion, name, description, wormholeAddress, umaOracleAdress) {
    // Deploy contract with ethers
    const factory = new ethers.ContractFactory(
        DATA_CONTRACT.abi,
        DATA_CONTRACT.bytecode,
        signer
    );

    const contract = await factory.deploy(cid, assertion, name, description, assertion, wormholeAddress, umaOracleAdress);
    // log
    console.log("Deploying contract...", cid, assertion, wormholeAddress, umaOracleAdress);
    await contract.deployed();
    console.log("deployed contract...", contract.address);
    return contract;
}

export async function requestAccess(signer, contractAddress) {
    // Deploy contract with ethers
    const contract = new ethers.Contract(
        contractAddress,
        DATA_CONTRACT.abi,
        signer
    );
    // log
    const tx = await contract.requestAccess();
    await tx.wait();
    console.log("Request access tx...", tx);
    const result = await contract.requestAccess.call();
    return { cid: result };
}

export const getMetadata = async (signer, address) => {
    const contract = new ethers.Contract(
        address,
        DATA_CONTRACT.abi,
        signer
    );
    const result = await contract.getMetadata.call();
    return result;
}