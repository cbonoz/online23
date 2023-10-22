import { polygonMumbai, avalanche, bsc, mainnet, filecoinCalibration, avalancheFuji, scrollSepolia } from '@wagmi/core/chains'

export const APP_NAME = 'ChainGuard'
export const APP_DESC = 'Cross-chain conditional data management and security'

export const ENC_FILE_NAME = 'encryptedzip.txt'

export const CHAIN_OPTIONS = [
  polygonMumbai, avalancheFuji, scrollSepolia
]

export const CHAIN_MAP = CHAIN_OPTIONS.reduce((acc, chain) => {
  acc[chain.id] = chain
  return acc
}, {})

// export const ACTIVE_CHAIN = polygonMumbai;// scrollSepolia;
export const ACTIVE_CHAIN = scrollSepolia;


// https://docs.uma.xyz/resources/network-addresses
export const UMA_ORACLE_MAP ={
  [polygonMumbai.id]: '0x263351499f82C107e540B01F0Ca959843e22464a'
}

// https://docs.wormhole.com/wormhole/reference/constants
export const WORMHOLE_RELAYER_MAP = {
  [polygonMumbai.id]: '0x0CBE91CF822c73C2315FB05100C2F714765d5c20',
  [avalancheFuji.id]: '0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C'

}


export const DEFAULT_ACCESS_CONDITIONS = [
  {
    contractAddress: "",
    standardContractType: "",
    chain: 'mumbai',
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "1000000000000", // 0.000001 ETH
    },
  },
];

// const AXELAR_MAPPING = {
//   [scrollSepolia.id]: 
//   [polygonMumbai.id]: 
// }

export const SISMO_IMPERSONATE = [
  "leo21.sismo.eth",
  "0xA4C94A6091545e40fc9c3E0982AEc8942E282F38",
  // Github
  "github:leo21",
  // Twitter
  "twitter:leo21_eth",
  // Telegram
  "telegram:leo21",
]



export const EXAMPLE_ITEM = {
    "id": 1,
    "name": "Oil price data set",
    "description": "The data contains Weekly crude oil prices from 5/1987 to 9/2023",
    "assertion": "The Philadelphia eagles won the super bowl in 2023",
    "crossChainId": avalancheFuji.id,
    "crossChainAddress": "0xf4982D4aC99d25d89Cc8993a88Dc643832B1515b",
    "sismoGroup": "0x1cde61966decb8600dfd0749bd371f12",  
    "hasAssertion": true,
    "hasCrossChainCondition": true,
    "hasSismo": true,
}

export const IPFS_BASE_URL = 'https://ipfs.io/ipfs'
// export const IPFS_BASE_URL = 'https://gateway.pinata.cloud/ipfs'
// export const IPFS_BASE_URL = 'https://saturn.ms/ipfs'

export const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS
