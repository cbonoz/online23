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
                {APP_NAME} is an open source project. You can find the code on GitHub&nbsp;
                <a href="https://github.com/cbonoz/online23" target="_blank">here</a>.
            </p>

            <p>
                {/* Files served from {APP_NAME} are verified and secured with Filecoin Saturn. */}
            </p>

            <p>

                {/* Create upload */}
                <Button type="primary" onClick={() => {
                    router.push('/create')
                }}>Create new data upload</Button>&nbsp;


            </p>

        </div>
    )
}