
'use client';

import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot,
  FirebaseStorage,
} from 'firebase/storage';
import {
  addDoc,
  collection,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';

export const uploadMaterial = (
  firestore: Firestore,
  storage: FirebaseStorage,
  userId: string,
  file: File,
  onProgress: (progress: number) => void
): Promise<void> => {

  return new Promise((resolve, reject) => {
    const storageRef = ref(
      storage,
      `users/${userId}/materials/${Date.now()}_${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error: any) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const materialsCollection = collection(
            firestore,
            `users/${userId}/materials`
          );
          await addDoc(materialsCollection, {
            userId: userId,
            title: file.name,
            url: downloadURL,
            type: file.type || 'unknown',
            createdAt: serverTimestamp(),
          });
          resolve();
        } catch (error) {
          console.error('Firestore document creation error:', error);
          reject(error);
        }
      }
    );
  });
};
