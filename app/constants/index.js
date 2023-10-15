import { polygonMumbai, avalanche, bsc, mainnet, filecoinCalibration, avalancheFuji } from '@wagmi/core/chains'

export const APP_NAME = 'ChainGuard'
export const APP_DESC = 'Cross-chain conditional data management and security'

export const CHAIN_OPTIONS = [
  polygonMumbai, avalancheFuji, mainnet, filecoinCalibration
]

export const ACTIVE_CHAIN = CHAIN_OPTIONS[0]

// export const ACTIVE_CHAIN = {
//     id: 314159,
//     name: 'Filecoin Calibration',
//     symbol: 'tFIL',
//     blockTimeSeconds: 30,
//     rpc: 'https://calibration.node.glif.io/',
//     explorerUrl: 'https://calibration.filscan.io/',
// }

export const UPLOAD_TABLE = process.env.NEXT_PUBLIC_UPLOAD_TABLE;
export const OFFER_TABLE = process.env.NEXT_PUBLIC_OFFER_TABLE;

export const EXAMPLE_ITEM = {
    "id": 1,
    "name": "Oil price data set",
    "description": "The data contains Weekly crude oil prices from 5/1987 to 9/2023",
}

// export const IPFS_BASE_URL = 'https://ipfs.filebase.io/ipfs'
// export const IPFS_BASE_URL = 'https://gateway.pinata.cloud/ipfs'
export const IPFS_BASE_URL = 'https://saturn.ms/ipfs'

export const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS
