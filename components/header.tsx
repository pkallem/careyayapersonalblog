import { useRef } from 'react';
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "../styles/header.module.css";

import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, IconButton, useColorMode, useDisclosure, useMediaQuery, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Button } from '@chakra-ui/react';

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
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              {isLargerThan768 ? (
                <>
                  <span className={styles.notSignedInText}>
                    Sign in to create your own blogs
                  </span>
                  <a
                    href="#"
                    className={styles.buttonPrimary}
                    onClick={(e) => {
                      e.preventDefault();
                      signIn();
                    }}
                  >
                    Sign in
                  </a>
                </>
              ) : (
                <>
                  <IconButton ref={btnRef} colorScheme="teal" onClick={onOpen} aria-label="Options" icon={<HamburgerIcon />} />
                  <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
                    <DrawerOverlay>
                      <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Menu</DrawerHeader>
                        <DrawerBody>
                          <Button onClick={(e) => { e.preventDefault(); signIn(); }}>Sign In</Button>
                        </DrawerBody>
                      </DrawerContent>
                    </DrawerOverlay>
                  </Drawer>
                </>
              )}
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
                href="#"
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </a>

              <a
                href="/protected"
                className={styles.button}
              >
                My Blogs
              </a>

              <a
                href="/"
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
