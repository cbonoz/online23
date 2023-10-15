import UiLayoutWrapper from './lib/UiLayoutWrapper';

import './globals.css';

export default function RootLayout({ children }) {

  return (<html>
    {/* <Script async src="https://saturn.tech/widget.js" /> */}
    <head>
      <link rel="preload" href="/fonts/AdelleSans-Regular.woff" as="font" crossOrigin="" />
      <link rel="preload" href="/fonts/AdelleSans-Regular.woff2" as="font" crossOrigin="" />
      <link rel="preload" href="/fonts/AdelleSans-Semibold.woff" as="font" crossOrigin="" />
      <link rel="preload" href="/fonts/AdelleSans-Semibold.woff2" as="font" crossOrigin="" />

      <link rel="favicon" href="/favicon.ico" sizes="any" />

      <title>Distributed Crypto | Distributed data management and security</title>
      <meta name="description" content="Privy Auth Starter" />
    </head>
    <body>
      <UiLayoutWrapper>
        {children}
      </UiLayoutWrapper>
    </body>
  </html>
  )

}