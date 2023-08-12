import '@/styles/globals.css'
import { Analytics } from '@vercel/analytics/react';
import {ClerkProvider, UserButton} from "@clerk/nextjs";
import Color from "@/components/Color";

export default function App({ Component, pageProps }) {
  return (
      <>
          <ClerkProvider {...pageProps}>
              <Color/>
              <h1 className={"title"}>
                  <a href={"https://mhlogs.com"}>MHLOGS</a>
                  <span><UserButton afterSignOutUrl={"/"}/></span>
              </h1>
              <Component {...pageProps} />
              <Analytics />
          </ClerkProvider>
      </>
  )
}
