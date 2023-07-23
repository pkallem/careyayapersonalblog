import { useRef } from 'react';
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "../styles/header.module.css";

import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, IconButton, useColorMode, useDisclosure, useMediaQuery, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Button, VStack, Flex } from '@chakra-ui/react';

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const btnRef = useRef(null);

  const { data: session, status } = useSession();
  const loading = status === "loading";
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <Flex justifyContent="space-between" alignItems="center" className={styles.signedInStatus}>
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
                href={`https://careyayapersonalblog.vercel.app/api/auth/signin`}
                className={styles.buttonPrimary}
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Sign in
              </a>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && isLargerThan768 && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                  className={styles.avatar}
                />
              )}

              <span className={styles.signedInText}>
                <strong>Welcome, {session.user.name}</strong>
                <br />
                {isLargerThan768 && 
                  <small>Signed in as {session.user.email ?? session.user.name}</small>
                }
              </span>

              {isLargerThan768 ? (
                <>
                  <a
                    href={`https://careyayapersonalblog.vercel.app/api/auth/signout`}
                    className={styles.button}
                    onClick={(e) => {
                      e.preventDefault();
                      signOut();
                    }}
                  >
                    Sign out
                  </a>

                  <a
                    href={`https://careyayapersonalblog.vercel.app/protected`}
                    className={styles.button}
                  >
                    My Blogs
                  </a>
                  <a
                    href={`https://careyayapersonalblog.vercel.app`}
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
              ) : (
                <>
                  <IconButton ref={btnRef} colorScheme="teal" onClick={onOpen} aria-label="Options" icon={<HamburgerIcon />} />
                  <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
                    <DrawerOverlay>
                      <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Welcome, {session.user.name}</DrawerHeader>
                        <DrawerBody>
                          <VStack spacing={4}>
                            <Button onClick={(e) => { e.preventDefault(); signOut(); }}>Sign Out</Button>
                            <Link href="/protected">
                              <Button>My Blogs</Button>
                            </Link>
                            <Link href="/">
                              <Button>Feed</Button>
                            </Link>
                            <Button onClick={toggleColorMode}>{colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</Button>
                          </VStack>
                        </DrawerBody>
                      </DrawerContent>
                    </DrawerOverlay>
                  </Drawer>
                </>
              )}
            </>
          )}
        </p>
      </Flex>
    </header>
  )
}
