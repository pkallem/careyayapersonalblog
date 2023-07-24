import { useRef, useEffect } from 'react';
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "../styles/header.module.css";

import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, IconButton, useColorMode, useDisclosure, useMediaQuery, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Button, VStack } from '@chakra-ui/react';

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const btnRef = useRef(null);

  const { data: session, status } = useSession();
  const loading = status === "loading";
  const { colorMode, toggleColorMode } = useColorMode();
    
  useEffect(() => {
    if (session?.user) {
      fetch('https://careyayapersonalblog.vercel.app/api/userinfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: session.user.id,
          bio: "No bio yet",
          resume_link: "blank"
        }),
      }).catch((error) => console.error('Error in fetch:', error));
    }
  }, [session]);
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

              {isLargerThan768 ? (
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
                    href={`https://careyayapersonalblog.vercel.app/portfolio/${session.user?.id}?author=${session.user.name}`}
                    className={styles.button}
                  >
                    Portfolio
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
                  <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
                    <DrawerOverlay>
                      <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Welcome, {session.user.name}</DrawerHeader>
                        <DrawerBody>
                          <VStack spacing={4}>
                            <Link href="/">
                              <Button>Feed</Button>
                            </Link>
                            <Link href="/protected">
                              <Button>My Blogs</Button>
                            </Link>
                            <Button onClick={toggleColorMode}>{colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</Button>
                            <Button onClick={(e) => { e.preventDefault(); signOut(); }}>Sign Out</Button>
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
      </div>
    </header>
  )
}
