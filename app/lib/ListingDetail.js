'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import {
    Card,
    Breadcrumb,
    Row,
    Col,
    Button,
    Divider,
    Spin,
    Input,
} from 'antd';
import { getExplorerUrl, getRpcError, humanError, ipfsUrl, isEmpty, } from '../util';
import { ACTIVE_CHAIN, APP_NAME, CHAIN_MAP, CHAIN_OPTIONS, } from '../constants';
import RenderObject from '../lib/RenderObject';

import { assertTruth, getMetadata, requestAccess, settleAndGetAssertionResult } from '../util/listingContract';
import { useAccount, useNetwork } from 'wagmi';
import { useEthersSigner } from '../hooks/useEthersSigner';
import ConnectButton from './ConnectButton';


const ListingDetail = ({ uploadId }) => {
    const [loading, setLoading] = useState(false)
    const [rpcLoading, setRpcLoading] = useState(false)
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
        setRpcLoading(true)
        setError()
        setResult()
        try {
            await requestAccess(signer, uploadId);
            console.log('request access', res)
            setResult(res)
        } catch (e) {
            console.log('error requesting access', e)
            // alert('Error requesting access: ' + humanError(e));
            setError(getRpcError(e))
        } finally {
            setRpcLoading(false)
        }
    }

    async function assert() {
        setError()
        setRpcLoading(true)
        setResult()
        try {
            const res = await assertTruth(signer, uploadId);
            console.log('assert', res)
            setResult({
                'assertTruth': 'completed'
            })
        } catch (e) {
            setError(getRpcError(e))
        } finally {
            setRpcLoading(false)
        }
    }

    async function submitTransaction() {
        if (!data) {
            setError('Error: No data found')
            setRpcLoading(false)
            return
        }

        setError()
        setRpcLoading(true)
        setResult()

        const targetAddress = data.crossChainAddress
        const targetChain = data.crossChainId
        const message = 'Cross chain message from ' + APP_NAME
        let res
        try {
            // res = await sendCrossChainMessage(signer, uploadId, targetAddress, targetChain, message);
            console.log('request access', res)
            setResult(res)
        } catch (e) {
            setError(getRpcError(e))
        } finally {
            setRpcLoading(false)
        }


    }

    async function settle() {
        setError()
        setRpcLoading(true)
        setResult()
        try {
            const res = await settleAndGetAssertionResult(signer, uploadId);
            console.log('settle', res)
            setResult({
                'settle': 'completed'
            })
        } catch (e) {
            setError(getRpcError(e))
        } finally {
            setRpcLoading(false)
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
        // console.log("checkData", checkData, uploadId, signer);
        if (checkData) {
            getData()
        }
    }, [uploadId, signer])

    const cardTitle = useMemo(() => {
        if (data) {
            return 'Found upload: ' + data.name
        } else if (error) {
            return 'Error: ' + humanError(error)
        } else {
            return 'Loading...'
        }

    }, [error, data])

    const hasAssertion = !isEmpty(data?.assertion)
    const hasCrossChain = !isEmpty(data?.crossChainId)
    const hasCondition = hasAssertion || hasCrossChain;

    const crossChainName = CHAIN_MAP[data?.crossChainId]?.name
    const isCrossChainAddressCorrect = address === data?.crossChainAddress

    if (!signer) {
        return <Card title="Listing details">
            <p className='bold'>Connect your wallet to view upload page.</p>
            <br />
            <ConnectButton />

        </Card>
    }

    return (
        <div className="upload-detail-page">
            <Breadcrumb items={breadcrumbs} />
            <br />
            <Card title={<span style={{ color: cardTitle.indexOf('Found') !== -1 ? 'green' : 'error-text' }}>{cardTitle}</span>}>
                {loading && <p>Loading...</p>}

                <Row gutter={{
                    xs: 8,
                    sm: 16,
                    md: 24,
                    lg: 32,

                }}>
                    <Col span={14}>

                        {!hasCondition && <h3>
                            This upload does not have any access restrictions.
                        </h3>}

                        {hasCondition && <div> <h3>
                            This upload has access restrictions. The below must be met to access the data:
                        </h3>

                            <br />
                            {hasAssertion && <li>1. Assertion must be true on contract: <b>{data.assertion}</b></li>}
                            {hasCrossChain && <li>2. A cross chain <b>transaction from {data.crossChainAddress} on {crossChainName}</b> to this contract</li>}
                        </div>
                        }

                        <Divider />

                        {/* <p>Contract Address: {uploadId}</p> */}
                        <RenderObject keys={['name', 'description', 'owner', 'cid']} json={data} />
                        <p>
                            <a href={getExplorerUrl(ACTIVE_CHAIN, uploadId)} target="_blank">View contract</a>
                        </p>
                    </Col>
                    <Col span={10}>
                        <Card title="Actions">
                            {data?.cid && <p>Access: <a href={ipfsUrl(data.cid)}>{data.cid}</a></p>}

                            {hasAssertion && <div>
                                <br />
                                <h4>Assertion actions</h4>
                                <Button type="link" onClick={() => assert()}>Assert Truth (step 1)</Button>
                                <Button type="link" onClick={() => settle()}>Settle and Get Assertion Result (step 2)</Button>
                            </div>}

                            {!hasCrossChain && <div>
                                <br />
                                <h4>Cross chain actions</h4>
                                {/* {!isCrossChainAddressCorrect && <p className='error-text'>Must be logged in with {data?.crossChainAddress}</p>} */}
                                <Input
                                    placeholder={`Enter ${crossChainName} DataContract address`}
                                />

                                <Button
                                    disabled={!isCrossChainAddressCorrect}
                                    loading={rpcLoading}
                                    onClick={submitTransaction}
                                >Send transaction</Button>


                            </div>}

                            <br />


                            <Button
                                type="primary"
                                size="large"
                                disabled={loading} loading={loading} onClick={accessData}>Check Access</Button>
                            <br />
                            {rpcLoading && <div>
                                <Spin size="large" />
                            </div>
                            }
                            <br />
                            {result && <div>
                                <RenderObject
                                    title="Result"
                                    json={result} />
                            </div>}

                            {error && <p className='error-text'>Error: {error}</p>}

                        </Card>
                    </Col>
                </Row>
                {/* {JSON.stringify(data)} */}
            </Card >
        </div >)
};

export default ListingDetail;