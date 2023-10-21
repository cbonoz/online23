// Next.js https://nextjs.org/docs/getting-started/installation
// in src/page.tsx 
"use client";

import {
    SismoConnectButton,
    AuthType,
    ClaimType,
} from "@sismo-core/sismo-connect-react";
import { SISMO_IMPERSONATE } from "../constants";

// https://docs.sismo.io/sismo-docs/build-with-sismo-connect/getting-started-1
export default function SismoButton({onResponseBytes}) {
    return (
        <SismoConnectButton
        overrideStyle={{margin: '10px', }}
            text="Connect with Sismo"
            theme="light"
            config={{
                appId: process.env.NEXT_PUBLIC_SISMO_APP_ID,
                vault: {
                    // For development purposes insert the Data Sources that you want to impersonate here
                    // Never use this in production
                    impersonate: SISMO_IMPERSONATE,
                },
                // displayRawResponse: true,
            }}
            auths={[{ authType: AuthType.GITHUB }]}
            claims={[
                { groupId: "0x1cde61966decb8600dfd0749bd371f12" },
            ]}
            signature={{ message: "I vote Yes to Privacy" }}
            // retrieve the Sismo Connect Reponse from the user's Sismo data vault
            // onResponse={async (response) => {
            //     const res = await fetch("/api/verify", {
            //         method: "POST",
            //         body: JSON.stringify(response),
            //     });
            //     const result = await res.json()
            //     console.log('onResponse', result);
            //     return result
            // }}
            // reponse in bytes to call a contract
            // onResponseBytes={async (response) => {
            //     console.log('onResponseBytes', response);
            // }}
            onResponseBytes={onResponseBytes}
        />
    );
}