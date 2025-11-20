
'use server';

import { initializeFirebase } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

/**
 * Uploads a file to Firebase Storage and creates a corresponding document in Firestore.
 *
 * @param userId - The ID of the user uploading the file.
 * @param file - The file to upload.
 */
export async function uploadMaterial(userId: string, file: File) {
    const { storage, firestore } = initializeFirebase();
    if (!storage || !firestore) {
        throw new Error("Firebase has not been initialized.");
    }
    
    // 1. Upload the file to Firebase Storage
    const storageRef = ref(storage, `users/${userId}/materials/${Date.now()}_${file.name}`);
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    // 2. Create a document in Firestore
    const materialsCollection = collection(firestore, `users/${userId}/materials`);
    await addDoc(materialsCollection, {
        userId: userId,
        title: file.name,
        url: downloadURL,
        type: file.type || 'unknown',
        createdAt: serverTimestamp(),
    });

    return {
        message: "File uploaded successfully",
        url: downloadURL,
        title: file.name,
    };
}
