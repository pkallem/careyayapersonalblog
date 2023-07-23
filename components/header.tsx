import { useRef } from 'react';
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "../styles/header.module.css";

import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { IconButton, useColorMode, useDisclosure, useMediaQuery, Drawer, DrawerBody, Button, VStack } from '@chakra-ui/react';

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const btnRef = useRef(null);
  const { data: session, status } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();

  const DarkModeSwitch = () => (
    <IconButton
      aria-label="Toggle dark mode"
      icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      onClick={toggleColorMode}
      className={styles.button}
      right={5}
    />
  );

  const SignedInText = () => (
    <span className={styles.signedInText}>
      <strong>Welcome, {session?.user?.name}</strong>
      <br />
      <small>Signed in as {session?.user?.email ?? session?.user?.name}</small>
    </span>
  );

  return (
    <header>
      <noscript><style>{`.nojs-show { opacity: 1; top: 0; }`}</style></noscript>
      <div className={styles.signedInStatus}>
        <p className={`nojs-show ${!session && status === 'loading' ? styles.loading : styles.loaded}`}>
          {!session ? (
            <>
              <span className={styles.notSignedInText}>Sign in to create your own blogs</span>
              <a href="/api/auth/signin" className={styles.buttonPrimary} onClick={(e) => { e.preventDefault(); signIn(); }}>
                Sign in
              </a>
            </>
          ) : (
            <>
              {session?.user?.image && <span style={{ backgroundImage: `url('${session.user.image}')` }} className={styles.avatar} />}
              <SignedInText />
              {isLargerThan768 ? (
                <>
                  <a href="/api/auth/signout" className={styles.button} onClick={(e) => { e.preventDefault(); signOut(); }}>
                    Sign out
                  </a>
                  <Link href="/protected"><a className={styles.button}>My Blogs</a></Link>
                  <Link href="/"><a className={styles.button}>Feed</a></Link>
                  <DarkModeSwitch />
                </>
              ) : (
                <>
                  <IconButton ref={btnRef} colorScheme="teal" onClick={onOpen} aria-label="Options" icon={<HamburgerIcon />} />
                  <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
                    <DrawerBody>
                      <VStack spacing={4}>
                        <Button onClick={(e) => { e.preventDefault(); signOut(); }}>Sign Out</Button>
                        <Link href="/protected"><Button>My Blogs</Button></Link>
                        <Link href="/"><Button>Feed</Button></Link>
                        <DarkModeSwitch />
                      </VStack>
                    </DrawerBody>
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