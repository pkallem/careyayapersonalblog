import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

interface DeleteConfirmationPopupProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationPopup({ onClose, onConfirm }: DeleteConfirmationPopupProps) {
  // You need to pass a ref to AlertDialog to manage focus
  const cancelRef = React.useRef();
  
  return (
    <AlertDialog
      isOpen={true}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Blog
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this blog?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" onClick={onConfirm} ml={3}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
