import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
          <title>MHLOGS</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="Utility tool to ease debugging" />
          <meta name="theme-color" content="#4bff89"/>
          <link rel="icon" href="https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/59/Oak_Log_%28UD%29_JE1.png/revision/latest?cb=20191229175531" />
          <meta property='og:type' content='website'/>
          <meta name="twitter:card" content="summary_large_image"/>
          <meta property="og:image" content="https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e9/Oak_Log_%28UD%29_JE5_BE3.png/revision/latest?cb=20200317191604" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css2?family=Russo+One:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
