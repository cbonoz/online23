'use client'

import { Breadcrumb, Spin } from "antd"
import ListingDetail from "../../lib/ListingDetail"
import { EXAMPLE_ITEM, generateItem } from "../../constants"
import React, { useState, useEffect } from "react"


export default function UploadPage({ params }) {
    const { uploadId } = params

    return (
        <div>
            <ListingDetail uploadId={uploadId} />
        </div>
    )
}