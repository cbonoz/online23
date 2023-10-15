'use client';

import { useState } from "react";

export default function Admin() {

    const [loading, setLoading] = useState(false)
    const [tableResult, setTableResult] = useState()
    const [verifyResult, setVerifyResult] = useState()
    const [error, setError] = useState()
    const [listingId, setListingId] = useState()
    return <div>
        <h1>Admin</h1>
    </div>



}