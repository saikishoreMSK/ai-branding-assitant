// hooks/useStoreUser.ts
import { db } from "../lib/firebase"; // Update the import path to where your Firebase config is
import { collection, doc, setDoc } from "firebase/firestore";

export const storeUserToFirestore = async ({ email, id }: { email: string; id: string }) => {
  try {
    await setDoc(doc(db, "users", id), {
      email: email,
      createdAt: new Date(),
    });
    console.log("User data stored in Firestore");
  } catch (error) {
    console.error("Error storing user data in Firestore", error);
  }
};
