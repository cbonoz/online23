'use client';

import { APP_DESC, APP_NAME, EXAMPLE_DATASETS } from "../constants";
import Image from 'next/image'
import Button from 'antd/es/button'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Divider } from "antd";


export default function About() {

    const router = useRouter()
    return (
        <div className="about-page">
            <br />
            <br />

            <p>
                <Image src="logo.png" alt="ChainGuard Logo" width={180} height={37} /><br /><br />
                {APP_NAME} | {APP_DESC}
            </p>


            <p>
            Traditional encryption is fairly basic i.e. are you the holder of this key, do you have access to this data.
            </p>
            <p>
                With ChainGuard you can define much more rich criteria and triggers to share encrypted data, such as any natural language statement in combination with cross chain criteria to unlock a piece of data for the end user.
            </p>

            {/* github */}
            <p>
                {APP_NAME} is an open source project and a hackathon prototype (hosted as-is). You can find the code on GitHub&nbsp;
                <a href="https://github.com/cbonoz/online23" target="_blank">here</a>.
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