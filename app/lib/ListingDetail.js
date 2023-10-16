'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import {
    Card,
    Breadcrumb,
} from 'antd';
import { abbreviate, convertCamelToHuman, formatCurrency, formatUpload, getExplorerUrl, humanError, ipfsUrl, isEmpty } from '../util';
import { ACTIVE_CHAIN, APP_NAME, EXAMPLE_OFFERS, STAT_KEYS } from '../constants';

import { getMetadata, requestAccess } from '../util/listingContract';
import { useAccount, useNetwork } from 'wagmi';
import { useEthersSigner } from '../hooks/useEthersSigner';


const ListingDetail = ({ uploadId }) => {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState()
    const [error, setError] = useState()
    const [data, setData] = useState()
    console.log('upload', uploadId)

    const { address } = useAccount();
    const { chain } = useNetwork();
    const signer = useEthersSigner({ chainId: chain?.id || ACTIVE_CHAIN.id })
    const breadcrumbs = [
        {
            title: 'Uploads',
            href: '/search'
        },
        {
            title: data?.name,
            href: `/upload/${uploadId}`
        }
    ]

    async function accessData() {
        setLoading(true)
        try {
            const res = await requestAccess(provider.signer, upload.address);
            console.log('request access', res)
            setResult(res)
        } catch (e) {
            console.error('error requesting access', e)
            alert('Error requesting access: ' + humanError(e));
        } finally {
            setLoading(false)
        }
    }

    async function getData() {
        setLoading(true)

        try {
            const d = await getMetadata(signer, uploadId)
            console.log('got data', d)
            setData(d)
        } catch (e) {
            console.error('error getting data', e)
            alert('Error getting data: ' + humanError(e));
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkData = uploadId && signer
        // log
        console.log("checkData", checkData, uploadId, signer);
        if (checkData) {
            getData()
        }
    }, [uploadId, signer])

    const cardTitle = useMemo(() => {
        if (data) {
            return 'Found data: ' + data.name
        } else if (error) {
            return 'Error: ' + humanError(error)
        } else {
            return 'Loading...'
        }

    }, [error, data])

    return (
        <div className="upload-detail-page">
            <Breadcrumb items={breadcrumbs} />
            <br />
            <Card title={<span style={{ color: cardTitle.indexOf('Found') !== -1 ? 'green' : 'error-text' }}>{cardTitle}</span>}>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {humanError(error)}</p>}
                {!signer && <p>Connect your wallet to view this upload.</p>}
                {JSON.stringify(data)}
            </Card>
        </div >)
};

export default ListingDetail;