'use client';

import { APP_DESC, APP_NAME, EXAMPLE_DATASETS } from "../constants";
import Image from 'next/image'
import Button from 'antd/es/button'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Divider } from "antd";


export default function About() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState()

    const router = useRouter()
    return (
        <div className="about-page">
            <br />
            <br />

            <p>
                <Image src="logo.png" alt="ChainGuard Logo" width={180} height={37} /><br /><br />
                {APP_NAME} | {APP_DESC}
            </p>

            {/* github */}
            <p>
                {APP_NAME} is an open source project. You can find the code on GitHub here:&nbsp;
                <a href="https://github.com/open23" target="_blank">GitHub</a>&nbsp;
            </p>

            <p>
                Files served from {APP_NAME} are verified and secured with Filecoin Saturn.
            </p>

            <p>
                Follow the guide here to unpack your purchased content.
                https://web3.storage/docs/how-tos/work-with-car-files/
            </p>

            <p>

                {/* Create upload */}
                <Button type="primary" onClick={() => {
                    router.push('/create')
                }}>Create secure data upload</Button>&nbsp;


            </p>

            <Divider />

            <Card title="Upload ideas">


                {EXAMPLE_DATASETS.map((item, i) => {
                    return <div key={i}>
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                        <p>{item.example}</p>
                    </div>
                })}

            </Card>

        </div>
    )
}