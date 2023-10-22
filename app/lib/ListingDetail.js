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
import { ACTIVE_CHAIN, APP_NAME, CHAIN_MAP, CHAIN_OPTIONS, DEFAULT_ACCESS_CONDITIONS, ENC_FILE_NAME, } from '../constants';
import RenderObject from '../lib/RenderObject';

import { assertTruth, getMetadata, requestAccess, settleAndGetAssertionResult, verifySismoConnectResponse } from '../util/listingContract';
import { useAccount, useNetwork } from 'wagmi';
import { useEthersSigner } from '../hooks/useEthersSigner';
import ConnectButton from './ConnectButton';
import SismoButton from './SismoButton';
import { decryptUserFile } from '../util/litHelper';


const ListingDetail = ({ uploadId }) => {
    const [loading, setLoading] = useState(false)
    const [rpcLoading, setRpcLoading] = useState(false)
    const [result, setResult] = useState()
    const [error, setError] = useState()
    const [data, setData] = useState()
    const [responseBytes, setResponseBytes] = useState();
    console.log('upload', uploadId)

    const { address } = useAccount();
    const { chain } = useNetwork();
    const signer = useEthersSigner({ chainId: chain?.id || ACTIVE_CHAIN.id })

    const breadcrumbs = [
        {
            title: 'Home',
            href: '/'
        },
        {
            title: data?.name,
            href: `/upload/${uploadId}`
        }
    ]

    function setRpcPending() {
        setError()
        setRpcLoading(true)
        setResult()
    }

    async function accessData() {
        setRpcPending()
        try {
            const res = await requestAccess(signer, uploadId);
            console.log('request access', res)
            setResult({ 'accessRequest': true })
            await getMetadata(signer, uploadId)
        } catch (e) {
            console.log('error requesting access', e)
            // alert('Error requesting access: ' + humanError(e));
            setError(getRpcError(e))
        } finally {
            setRpcLoading(false)
        }
    }

    async function assert() {
        setRpcPending()
        try {
            const res = await assertTruth(signer, uploadId);
            console.log('assert', res)
            setResult({
                'assertTruth': 'Completed, please wait settle period'
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

        setRpcPending()

        const targetAddress = data.crossChainAddress
        const targetChain = data.crossChainId
        const message = 'Cross chain message from ' + APP_NAME
        let res
        try {
            // TODO:
            alert('Cross chain from app UI not yet implemented. Please use Remix or another RPC platform')
            // res = await sendCrossChainMessage(signer, uploadId, targetAddress, targetChain, message);
            // console.log('request access', res)
            // setResult(res)
        } catch (e) {
            setError(getRpcError(e))
        } finally {
            setRpcLoading(false)
        }


    }

    async function settle() {
        setRpcPending()
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
    const hasSismo = !isEmpty(data?.sismoGroup) && data?.sismoGroup != '0x00000000000000000000000000000000'
    const hasCondition = hasAssertion || hasCrossChain || hasSismo;

    const crossChainName = CHAIN_MAP[data?.crossChainId]?.name
    const isCrossChainAddressCorrect = address === data?.crossChainAddress

    if (!signer) {
        return <Card title="Listing details">
            <p className='bold'>Connect your wallet to view upload page.</p>
            <br />
            <ConnectButton connectOnMount />

        </Card>
    }

    async function downloadZipFileFromCid(cid) {
        setError()
        console.log('downloadZipFileFromCid', cid)
        const zipFileUrl = ipfsUrl(cid, ENC_FILE_NAME)
        const res = await fetch(zipFileUrl)
        const resText = await res.text();
        const {ciphertext, dataToEncryptHash} = JSON.parse(resText)

        const blob = decryptUserFile(ciphertext, dataToEncryptHash, DEFAULT_ACCESS_CONDITIONS);
        const fileName = 'data.zip'
        const file = new File([blob], fileName, { type: 'application/zip' });
        const url = URL.createObjectURL(file)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
    }

    async function onResponse(bytes) {
        console.log('onResponseBytes', bytes)
        setResponseBytes(bytes)
    }

    async function verifySismo() {
        setRpcPending()
        try {
            await verifySismoConnectResponse(signer, uploadId, responseBytes)
            await getMetadata(signer, uploadId)
        } catch (e) {
            console.error('verifySismo', e)
            setError(getRpcError(e))
        } finally {
            setRpcLoading(false)
        }
    }

    const { assertSuccess, crossChain, sismo } = data?.conditions || {}

    function RenderCondition({ isTrue, children }) {
        return <span className={isTrue ? 'success-text' : ''}>
            {children}
            {isTrue && <span>&nbsp;✅</span>}
        </span>
    }

    const conditionsMet = data?.cid

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
                            <ol style={{ paddingLeft: '16px' }}>
                                {hasAssertion && <li><RenderCondition isTrue={assertSuccess}>Assertion must be true on contract:&nbsp;<b>{data.assertion}</b></RenderCondition></li>}
                                {hasCrossChain && <li><RenderCondition isTrue={crossChain}>A cross-chain transaction from:&nbsp;<b>{data.crossChainAddress} on {crossChainName}</b> to this contract</RenderCondition></li>}
                                {hasSismo && <li><RenderCondition isTrue={sismo}>A Sismo Connect response with claim:&nbsp;<b>{data.sismoGroup}</b></RenderCondition></li>}
                            </ol>
                        </div>
                        }

                        <Divider />

                        {/* <p>Contract Address: {uploadId}</p> */}
                        <RenderObject keys={['name', 'description', 'owner', 'contract']} json={data} />
                        <p>
                            <a href={getExplorerUrl(ACTIVE_CHAIN, uploadId)} target="_blank">View contract</a>
                        </p>
                        {/* {JSON.stringify(data, null, 2)} */}
                    </Col>
                    <Col span={10}>
                        <Card title="Actions">
                            {!conditionsMet && <div>
                                {hasAssertion && <div className='standard-margin'>
                                    <h4>Assertion actions</h4>
                                    <Button type="link" onClick={() => assert()}>Assert Truth (step 1)</Button>
                                    <Button type="link" onClick={() => settle()}>Settle and Get Assertion Result (step 2)</Button>
                                </div>}


                                {hasCrossChain && <div className='standard-margin'>
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
                                {hasSismo && <div className='standard-margin'>
                                    <h4>Sismo verification</h4>
                                    <SismoButton onResponseBytes={onResponse} />

                                    {responseBytes && <Button type="link" onClick={verifySismo}>Verify Sismo credential</Button>}

                                </div>}

                                <br />


                                <Button
                                    type="primary"
                                    size="large"
                                    loading={rpcLoading || loading}
                                    disabled={rpcLoading || loading} onClick={accessData}>Attempt Access</Button>

                            </div>}

                            {conditionsMet && <div>
                                <h3 className='success-text'>Data available for download
                                {data?.cid && <span>&nbsp;✅</span>}
                                </h3>
                                <br />
                                <Button type="primary" onClick={e => {
                                    e.preventDefault()
                                    downloadZipFileFromCid(data.cid)
                                }}>Download data here</Button></div>}


                            <br />
                            {rpcLoading && <div>
                                <br />
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