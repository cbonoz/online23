<br/>
<p align='center'>
    <img src='./public/logo.png' width=400 />
</p>
<br/>

---

Blockreach
---

<!-- Blockreach is a sales and outreach platform that uses Polygon as a source chain to any number of N chains with Filecoin as an attachment mechanism. -->

Enable encryption and decryption of data based on a custom combination of cross chain and natural language statements.

Traditional encryption is extremely binary and basic, i.e. are you the holder of this key, do you have access to this data on this chain.

With this app you can define any natural language statement in combination with cross chain criteria to unlock a piece of data for the end user.

This enables triggers such as those based on world events, or things like inheritance, to only be triggered upon certain statements or when two parties regardless of chain origin agree that a piece of data should be unlocked for an end user. 

Or other examples where you might need a lawyer to mediate or validate a transaction or the release of a particular piece of data instead you can inspect blockchain states.

Distributed Crypto

Blockchain Mediation Services: There are services that facilitate dispute resolution on blockchains, but they may not offer the same level of encryption and decentralized access control as your solution.

Encryption Services: Standard encryption services provide data security, but they lack the dynamic, event-based triggers that your product aims to offer.

Blockchain-Based Inheritance Solutions: Some projects focus on blockchain-based inheritance, but they may not offer the same broad set of natural language and cross-chain criteria for unlocking data.

Cross-Chain Platforms: Projects like Wormhole and Polkadot aim to connect multiple blockchains, but they may not provide the natural language processing and encryption features you propose.

Zero-Knowledge Proof Solutions: While zero-knowledge proofs provide privacy, they might not offer the same level of natural language interaction and condition-based access.

Identity Verification Services: Identity verification services can confirm the authenticity of users, but they ofte

Keep Network is a decentralized key management system that allows users to store their private keys in a secure and distributed manner. However, it is still under development and does not support natural language statements or cross-chain transactions.
Secret Network is a privacy-focused blockchain platform that allows users to store and manage data securely. However, it is still under development and does not support natural language statements or cross-chain transactions.

<!-- Zero knowledge Pay to contact links for everyone based on Ethereum addresses instead of emails. -->





## Inspiration


## What it does

### Core functions
* Upload and lock dataset
* Define unlock criteria (both natural language and cross chain).
* Make inactive or active

## Technologies used

Scroll/Polygon: Contract backbones

UMA: Used for natural language data unlock

Hyperlane: Used for cross transactions

Sismo: Verify connected wallet has some criteria

Filecoin: Data upload and security until unencrypted

Lit Protocol: Core encryption and decryption

NextJS: We utilized NextJS to create a responsive and interactive frontend interface that offers a seamless browsing experience for users. Deployed on surge.

## Running the project (from scratch)

1. Copy `.env.sample` -> `.env`

2. Define the `NEXT_PUBLIC_ADMIN_ADDRESS` to your desired management address in `.env`. This account will be used to set up the app tables and verify submitted listings.

3. `yarn; yarn dev`. The app should now be running on port 3000.

4. Go to `localhost:3000/admin`. Connect your wallet using the same address from step 3. Note other pages will not be functional yet.

5. Deploy tables and copy table values to `.env`. Fill in remaining `.env` values.

6. Restart the server and test locally.

7. Do a production build and deployment following the below.

Any repeated starts can be done with `yarn dev` once all variables set.

### Deployment build

This command deploys the build site to surge.sh by default, feel free to edit to your desired deployment destination in `package.json`.

`yarn build; yarn deploy`


### Screenshots




## Potential future work


### Useful links
* https://ethglobal.com/events/ethonline2023/prizes
