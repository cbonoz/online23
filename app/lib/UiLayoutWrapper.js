'use client';

import { usePathname } from "next/navigation"
import Link from "next/link";
import { abbreviate, isAdminAddress } from "../util";
import { ACTIVE_CHAIN, APP_NAME } from "../constants";
import StyledComponentsRegistry from "./AntdRegistry";
import { Button, ConfigProvider, Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Image from "next/image";
import ConnectButton from "./ConnectButton";
import { Theme } from "@ant-design/cssinjs";

function UiLayoutWrapper({ children }) {

    const pathname = usePathname()
    const { connect, wallet, logout } = {}

    const menuItems = [
        // {
        //     key: '/search',
        //     label: <Link href="/search">Search listings</Link>,
        //     href: '/search',
        // },
        {
            key: '/create',
            label: <Link href="/create">Create</Link>,
            href: '/create',
        },
        {
            key: '/about',
            label: <Link href="/about">About</Link>,
            href: '/about',
        },
    ]

    const isAdmin = isAdminAddress(wallet?.address)

    if (isAdmin) {
        menuItems.push({
            key: '/admin',
            label: <Link href="/admin">Admin</Link>,
            href: '/admin',
        })
    }

    return (
        <StyledComponentsRegistry>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#6B2E7A',
                    },
                }}
            >
                <Layout>
                    <Header style={{ background: '#fff', display: 'flex' }}>
                        <Image src="/logo.png" alt="ChainGuard Logo"
                            className='header-logo'
                            height={48}
                            onClick={() => {
                                window.location.href = '/'
                            }}
                            width={180}
                        />

                        <Menu style={{ minWidth: '800px' }}
                            mode="horizontal" defaultSelectedKeys={pathname} items={menuItems} />

                        <span style={{ float: 'right', right: 20, position: 'absolute' }}>
                            <ConnectButton size="middle" />
                            {/* {!wallet?.address && <Button href="#" type="primary" onClick={connect}>Connect</Button>} */}
                            {/* {wallet?.address && <span>{abbreviate(wallet?.address)}&nbsp;(<a href="#" onClick={logout}>logout</a>)</span>} */}
                        </span>

                    </Header>
                    <span className='float-right bold active-network' >
                        Active network: {ACTIVE_CHAIN.name}&nbsp;
                    </span>
                    <Content className='container'>
                        {/* Pass children to the content area */}
                        <div className='container'>
                            {children}
                        </div>
                    </Content>

                    <Footer style={{ textAlign: 'center' }}>
                        <hr />
                        <br />
                        {APP_NAME} ©2023. Created for the&nbsp;
                        <a href="https://ethglobal.com/events/ethonline2023" target='_blank'>EthOnline 2023</a> hackathon.

                    </Footer>
                </Layout>
            </ConfigProvider>
        </StyledComponentsRegistry>
    )
}

export default UiLayoutWrapper