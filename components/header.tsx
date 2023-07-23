import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "../styles/header.module.css"

import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Box, IconButton, useColorMode } from '@chakra-ui/react';

export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const { colorMode, toggleColorMode } = useColorMode();


  return (
    
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                Sign in to create your own blogs
              </span>
              <a
                href={`https://careyayapersonalblog-git-main-pkallem.vercel.app/api/auth/signin`}
                className={styles.buttonPrimary}
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Sign in
              </a>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                  className={styles.avatar}
                />
              )}
                            
              <span className={styles.signedInText}>
                <strong>Welcome, {session.user.name}</strong>
                <br />
                <small>Signed in as {session.user.email ?? session.user.name}</small>
              </span>
              
              <a
                href={`https://careyayapersonalblog-git-main-pkallem.vercel.app/api/auth/signout`}
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                }}
              >
                Sign out
              </a>

              <a
                href={`https://careyayapersonalblog-git-main-pkallem.vercel.app/protected`}
                className={styles.button}
                
              >
                My Blogs
              </a>
              <a
                href={`https://careyayapersonalblog-git-main-pkallem.vercel.app/`}
                className={styles.button}
                
              >
                Feed
              </a>
              <IconButton
                aria-label="Toggle dark mode"
                icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                className={styles.button}
                right={5}
              />

            </>
            
          )}
        </p>
      </div>

    </header>
    
  )
}
