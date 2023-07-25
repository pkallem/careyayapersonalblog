import { SessionProvider } from "next-auth/react"
import { ChakraProvider } from "@chakra-ui/react";

export default function App({
  Component,
  pageProps
}) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  )
}
