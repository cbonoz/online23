'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import {
    Card,
    Breadcrumb,
    Row,
    Col,
    Button,
} from 'antd';
import { getExplorerUrl, humanError, ipfsUrl, } from '../util';
import { ACTIVE_CHAIN, } from '../constants';
import RenderObject from '../lib/RenderObject';

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
        setError()
        try {
            await requestAccess(signer, uploadId);
            console.log('request access', res)
            setResult(res)
            await getData();
        } catch (e) {
            console.error('error requesting access', e)
            // alert('Error requesting access: ' + humanError(e));
            setError(humanError(e))
        } finally {
            setLoading(false)
        }
    }

    async function getData() {
        setLoading(true)

        try {
            const d = await getMetadata(signer, uploadId)
            d['contract'] = uploadId;
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

                <Row>
                    <Col span={12}>
                        {/* <p>Contract Address: {uploadId}</p> */}
                        <RenderObject json={data} />


                <a href={getExplorerUrl(ACTIVE_CHAIN, uploadId)} target="_blank">View contract</a>

                    </Col>
                    <Col span={12}>
                        <Button 
                        type="primary"
                        size="large"
                        disabled={loading} loading={loading} onClick={accessData}>Check Access</Button>

                        {data?.cid && <p>Access: <a href={ipfsUrl(data.cid)}>{data.cid}</a></p>}
                        {error && <p>Error: {error}</p>}
                    </Col>
                </Row>
                {/* {JSON.stringify(data)} */}
            </Card>
        </div >)
};

export default ListingDetail;