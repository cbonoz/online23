<br/>
<p align='center'>
    <img src='./public/logo.png' width=400 />
</p>
<br/>

---

Blockreach
---

Blockreach is a sales and outreach platform that uses Polygon as a source chain to any number of N chains with Filecoin as an attachment mechanism.



<!-- Zero knowledge Pay to contact links for everyone based on Ethereum addresses instead of emails. -->





## Inspiration


## What it does

### Core functions

## Technologies used

Scroll:

Mask Network:

Push Protocol:

Notifications when a new message is received.

Tableland:

Lit Protocol:

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
