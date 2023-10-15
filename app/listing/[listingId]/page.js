'use client'

import { Breadcrumb, Spin } from "antd"
import UploadDetail from "../../lib/UploadDetail"
import { EXAMPLE_ITEM, generateItem } from "../../constants"
import React, { useState, useEffect } from "react"


export default function UploadPage({ params }) {
    const { uploadId } = params

    return (
        <div>
            <UploadDetail uploadId={uploadId} />
        </div>
    )
}