'use client'

import React, { useEffect, useState } from "react";
import { Button, Input, Row, Col, Steps, Result, Divider, Checkbox, Card, Image } from "antd";
import { uploadUrl, ipfsUrl, getExplorerUrl, humanError, isEmpty, } from "../util";
import { uploadFiles } from "../util/stor";
import TextArea from "antd/lib/input/TextArea";
import { EXAMPLE_ITEM, UMA_ORACLE_MAP,  ACTIVE_CHAIN, APP_NAME, WORMHOLE_RELAYER_MAP } from "../constants";
import { FileDrop } from "./FileDrop";
import { ethers } from "ethers";
import { deployContract } from "../util/listingContract";
import { useAccount, useNetwork } from "wagmi";
import ConnectButton from "./ConnectButton";
import { useEthersSigner } from '../hooks/useEthersSigner'

const { Step } = Steps;

function CreateListing() {
  const provider = {};
  const { address } = useAccount()
  const { chain } = useNetwork()

  const signer = useEthersSigner({ chainId: chain?.id })

  //   useEffect(() => {
  //     const networkId = network?.chain?.id
  //     console.log('network', network)
  //     if (networkId) {
  //       refetch()
  //     }
  //   }, [network, account])

  const [data, setData] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  const setDemo = () => setData({ ...EXAMPLE_ITEM })

  const updateData = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const getActiveError = (data) => {
    if (!data.name || !data.description) {
      return "Please provide a name and description for the upload.";
    }

    if (!data.useCid && isEmpty(data.files)) {
      return "Must add at least one file";
    } else if (data.useCid && isEmpty(data.cid)) {
      return "Must provide a CID for the upload";
    }

    return undefined
  };

  const errMessage = getActiveError(data);

  const create = async () => {
    setError(undefined);

    if (errMessage) {
      setError(errMessage)
      return;
    }

    if (!signer) {
      setError(`Please connect a valid ${ACTIVE_CHAIN.name} wallet`);
      return;
    }

    setLoading(true);
    const body = { ...data };
    if (!isEmpty(body.keywords)) {
      body['description'] = `${body.description}} | {${body.keywords}}}`
    }

    // Format files for upload.
    const files = (body.files || []).map((x) => {
      return x;
    });

    let res = { ...data };

    try {
      // 1) Create files/metadata to ipfs.
      let cid = data.cid
      if (!data.useCid) {
        if (!isEmpty(data.files)) {
          cid = await uploadFiles(
            files,
            res
          );
        } else {
          throw new Error("No files found");
        }
      }

      // 2) deploy contract with initial metadata
      let contract;
      const activeChainId = chain?.id || ACTIVE_CHAIN.id
      const umaOracleAdress = UMA_ORACLE_MAP[activeChainId]
      const wormholeAddress = WORMHOLE_RELAYER_MAP[activeChainId]
      contract = await deployContract(signer, cid, data.assertion || '', wormholeAddress, umaOracleAdress);
      // contract = {
      //   address: '0x1234'
      // }
      res["cid"] = cid;
      res["contract"] = contract.address;
      res["uploadUrl"] = uploadUrl(contract.address || cid);
      res["contractUrl"] = getExplorerUrl(contract.address);

      // 3) create table entry
      const upload = { ...data } // TODO: set all fields.
      upload['address'] = contract.address;

      // tableland
      // try {
      //   const uploadResult = createUpload(provider.signer, upload)
      // } catch (e) {
      //   console.error('error creating db upload', e)
      // }

      // Result rendered after successful doc upload + contract creation.
      setResult(res);
    } catch (e) {
      console.error("error creating chainguard request", e);
      const message = e.reason || e.response?.message || e.message
      setError(humanError(message))
    } finally {
      setLoading(false)
    }
  };

  const getStep = () => {
    if (!!result) {
      return 2;
    } else if (!errMessage) {
      return 1;
    }
    return 0;
  };

  return (
    <div>
      <Row>
        <Col span={24}>
          <div className="centered standard-margin">
            <Image src="logo.png" alt="ChainGuard Logo" width={180} height={37} />
            <h3>Create new data upload</h3>
            <br />
            <br />
          </div>
        </Col>
      </Row>

      <Row>

        <Col span={16}>

          <div className="create-form white boxed">
            {!result && <>
              <h3 className="vertical-margin">General Information:</h3>
              <a href="#" onClick={e => {
                e.preventDefault()
                setDemo()
              }}>Set demo values</a>
              <Divider />


              <h4>Name</h4>
              <Input
                placeholder="Name of upload"
                value={data.name}
                onChange={(e) => updateData("name", e.target.value)}
              />
              <br />
              <br />
              <h4>Description</h4>
              <TextArea
                aria-label="Description"
                onChange={(e) => updateData("description", e.target.value)}
                placeholder="Add any additional description on the upload"
                prefix="Description"
                value={data.description}
              />
              <br />
              <br />
              <h4>Address</h4>
              <Input
                placeholder={'Your address'}
                value={address || data.createdBy}
                disabled
                onChange={(e) => updateData("createdBy", e.target.value)}
              />

              {/* Checkbox for useCid */}
              <br />
              <br />
              <h4>Is this a large dataset (over 5MB) or do you have a CID already?</h4>

              <Checkbox
                type="checkbox"
                checked={data.useCid}
                onChange={(e) => updateData("useCid", e.target.checked)}
              />

              <br />
              <br />


              {data.useCid && <>

                <Card title="Provide CID link">
                  <br />
                  <p>Use an existing cid or a <a href="https://lotus.filecoin.io/tutorials/lotus/large-files/" target="_blank">Lotus</a> client to upload an encrypted or unencrypted (less secure) dataset.</p>
                  <br />
                  <h4>Data CID</h4>
                  <Input
                    placeholder="Data CID"
                    value={data.cid}
                    onChange={(e) => updateData("cid", e.target.value)}
                  />
                </Card>
              </>}

              {/* <p>Enter a list of addresses that could potentially access the data</p> */}

              <Card title="Enter access condition(s)">

                {/* UMA assertion */}
                <Input
                  placeholder="Enter UMA assertion"
                  value={data.assertion}
                  onChange={(e) => updateData("assertion", e.target.value)} />

              </Card>

              {/* <p>Enter conditions:</p> */}

              {!data.useCid && <>
                <Card title="Upload file">

                  {/* <h3 className="vertical-margin">Upload dataset(s) for purchaseable collection</h3> */}
                  <FileDrop
                    files={data.files || []}
                    setFiles={(files) => updateData("files", files)}
                  />

                </Card>
              </>}

              {/* TODO: add configurable amount of items */}

              <div>

                <Divider />
                {address && <Button
                  type="primary"
                  className="standard-button"
                  onClick={create}
                  disabled={loading || errMessage}
                  loading={loading}
                  size="large"
                >
                  Create Upload
                </Button>}

                {!address && <ConnectButton text="Connect wallet to continue" />}

                {!error && !result && loading && (
                  <span className="italic">&nbsp;Deploying a DataContract. Confirmation may take a few moments.</span>
                )}

              </div>

              <br />
              <br />
            </>}
            {error && <div className="error-text">Error: {error}</div>}
            {result && (<div>
              <Result status="success"
                title="Upload created! Confirm last transaction to index the result" subTitle="Access your data page and content below. It may take a few minutes to confirm the upload on the network." />
              <div>
                <Button href={ipfsUrl(result.cid)} target="_blank">
                  Download files
                </Button>
                {/* (download secure <a href="https://spec.filecoin.io/systems/filecoin_files/piece/#:~:text=In%20order%20to%20make%20a,un%2DCAR'ed%20constructions." target="_blank">.car</a> format) */}
                <br />
                <a href={result.contractUrl} target="_blank">
                  View created contract
                </a>
                <br />
                <br />
                <p>
                  Share or post this page with potential buyers:
                  <br />
                  <a href={result.uploadUrl} target="_blank">
                    View upload page
                  </a> (the upload may take a few minutes to become available on the network).
                </p>
              </div>
            </div>
            )}
          </div>
        </Col>
        <Col span={1}></Col>
        <Col span={7}>
          <div className="white boxed">
            <Steps
              className="standard-margin"
              direction="vertical"
              size="small"
              items={[{
                title: 'Fill in fields',
                description: 'Upload data and specify access conditions.'
              }, {
                title: `Create ${APP_NAME} upload`,
                description: 'Deploys a smart contract and creates an access page for the dataset'
              }, {
                title: 'Share the generated access url for your data',
              }]}
              current={getStep()}
            >
            </Steps>
          </div>
        </Col>
      </Row>
    </div >
  );
}

export default CreateListing;