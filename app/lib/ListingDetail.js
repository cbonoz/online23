'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
    Card,
    Button,
    Statistic,
    Row,
    Col,
    Spin,
    Divider,
    Modal,
    Input,
    Breadcrumb,
    Result,
} from 'antd';
import Image from 'next/image'
import { abbreviate, convertCamelToHuman, formatCurrency, formatUpload, getExplorerUrl, humanError, ipfsUrl, isEmpty } from '../util';
import { ACTIVE_CHAIN, APP_NAME, EXAMPLE_OFFERS, STAT_KEYS } from '../constants';

import { getMetadata, purchaseContract } from '../util/listingContract';


const UploadDetail = ({ uploadId }) => {
    const [loading, setLoading] = useState(true)
    const [offerData, setOfferData] = useState(EXAMPLE_OFFERS)
    const [showOfferModal, setShowOfferModal] = useState(false)
    const [result, setResult] = useState()
    const [error, setError] = useState()
    const [upload, setUpload] = useState()
    const [amount, setAmount] = useState()
    console.log('upload', uploadId)

    const breadcrumbs = [
        {
            title: 'Uploads',
            href: '/search'
        },
        {
            title: upload?.name,
            href: `/upload/${uploadId}`
        }
    ]

    async function makePurchase() {
        setLoading(true)
        try {
            const res = await purchaseContract(provider.signer, upload.address, upload.price.toString())
            console.log('purchase', res)
            setResult(res)
            try {
                addPurchase(provider.signer, upload.address)
            } catch (e) {

            }
        } catch (e) {
            console.error('error purchasing', e)
            alert('Error purchasing: ' + humanError(e));
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="upload-detail-page">
            <Breadcrumb items={breadcrumbs} />
            <br />
            <Card title={<span style={{ color: "green" }}>For Purchase</span>}>


            </Card>
        </div>)
};

export default UploadDetail;