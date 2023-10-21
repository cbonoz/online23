import { Button } from 'antd'
import { useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { ACTIVE_CHAIN } from '../constants'
 
function ConnectButton({size='large', buttonType = 'primary', text = 'Connect Wallet', connectOnMount=false}) {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
  useSwitchNetwork()

  const network = useNetwork()
  useEffect(() => {
    if (connectOnMount) {
      connect()
    }
  }, [])

  useEffect(() => {
    // console.log('check switch', network.chain, pendingChainId, ACTIVE_CHAIN.id, isConnected);
    if (network && network.chain?.id !== ACTIVE_CHAIN.id) {
      switchNetwork?.(ACTIVE_CHAIN.id)
    }
  }, [pendingChainId, network, isConnected])

  if (isConnected)
    return (
      <div>
        Connected to: {address}
        <Button type="link" size={size} onClick={() => disconnect()}>Disconnect</Button>
      </div>
    )
  return <Button type={buttonType} size={size} onClick={() => connect()}>{text}</Button>
}

export default ConnectButton