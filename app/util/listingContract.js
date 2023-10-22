import { ethers } from "ethers";
import { DATA_CONTRACT } from "./metadata";

export async function deployContract(signer, cid, assertion, name, description, crossChainAddress, crossChainId, wormholeAddress, umaOracleAdress, sismoGroup) {
    // Deploy contract with ethers
    const factory = new ethers.ContractFactory(
        DATA_CONTRACT.abi,
        DATA_CONTRACT.bytecode,
        signer
    );

    const contract = await factory.deploy(cid, assertion, name, description, crossChainAddress, crossChainId, wormholeAddress, umaOracleAdress, sismoGroup);
    // log
    console.log("Deploying contract...", cid, assertion, name, description, crossChainAddress, crossChainId, wormholeAddress, umaOracleAdress, sismoGroup);

    await contract.deployed();
    console.log("deployed contract...", contract.address);
    return contract;
}

export const verifySismoConnectResponse = async (signer, contractAddress, response) => {
    const contract = new ethers.Contract(
        contractAddress,
        DATA_CONTRACT.abi,
        signer
    );
    console.log('verify', response)
    const tx = await contract.verifySismoConnectResponse(response);
    await tx.wait();
    console.log("verifySismoConnectResponse tx...", tx);
    const result = await contract.verifySismoConnectResponse.call(response);

    return { verifySismoConnectResponse: result };
}

export const addAllowedAddress = async (signer, contractAddress, address) => {
    const contract = new ethers.Contract(
        contractAddress,
        DATA_CONTRACT.abi,
        signer
    );
    const tx = await contract.addAllowedAddress(address);
    await tx.wait();
    console.log("addAllowedAddress tx...", tx);
    const result = await contract.addAllowedAddress.call(address);
    return { addAllowedAddress: address };
}

export const assertTruth = async (signer, contractAddress) => {
    const contract = new ethers.Contract(
        contractAddress,
        DATA_CONTRACT.abi,
        signer
    );
    const tx = await contract.assertTruth();
    await tx.wait();
    console.log("assert truth tx...", tx);
    const result = await contract.assertTruth.call();
    return { assertTruth: result };
}

export const settleAndGetAssertionResult = async (signer, contractAddress) => {
    const contract = new ethers.Contract(
        contractAddress,
        DATA_CONTRACT.abi,
        signer
    );
    const tx = await contract.settleAndGetAssertionResult();
    await tx.wait();
    console.log("settleAndGetAssertionResult tx...", tx);
    const result = await contract.settleAndGetAssertionResult.call();
    console.log('settle result', result)
    return { settleAndGetAssertionResult: result };
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
    return { requestAccess: true}
}

export const getMetadata = async (signer, address) => {
    const contract = new ethers.Contract(
        address,
        DATA_CONTRACT.abi,
        signer
    );
    const result = await contract.getMetadata.call();
    console.log('result', result)
    return {
        name: result[0],
        description: result[1],
        cid: result[2],
        assertion: result[3],
        crossChainAddress: result[4],
        crossChainId: result[5].toNumber(),
        owner: result[6],
        active: result[7],
        totalAccess: result[8].toNumber(),
        sismoGroup: result[9],
        conditions: {
            assertion: result[10][0],
            crossChain: result[10][1],
            allowedAddress: result[10][2],
            sismo: result[10][3],
        }
    };
}