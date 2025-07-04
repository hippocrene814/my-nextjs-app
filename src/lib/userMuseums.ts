import { doc, setDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./firebase";

export async function saveUserMuseum({
    userId,
    museumId,
    visited,
    wish,
    notes,
  }: {
    userId: string;
    museumId: string;
    visited: boolean;
    wish: boolean;
    notes?: string;
  }) {
    // Encode userId and museumId to make Firestore docId safe
    const safeUserId = encodeURIComponent(userId);
    const safeMuseumId = encodeURIComponent(museumId);
    const docId = `${safeUserId}_${safeMuseumId}`;
    const ref = doc(db, "user_museums", docId);
  
    await setDoc(
      ref,
      {
        user_id: userId,
        museum_id: museumId,
        visited,
        wish,
        notes: notes || "",
      },
      { merge: true } // Only updates the fields you provide
    );
  }

// Fetch a user's museum data from Firestore
type UserMuseumDoc = {
  user_id: string;
  museum_id: string;
  visited: boolean;
  wish: boolean;
  notes?: string;
};

export async function getUserMuseum(userId: string, museumId: string): Promise<UserMuseumDoc | null> {
  const safeUserId = encodeURIComponent(userId);
  const safeMuseumId = encodeURIComponent(museumId);
  const docId = `${safeUserId}_${safeMuseumId}`;
  const ref = doc(db, "user_museums", docId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as UserMuseumDoc;
  }
  return null;
}

// Fetch all user-museum docs for a user
export async function getAllUserMuseums(userId: string): Promise<UserMuseumDoc[]> {
  const q = query(
    collection(db, "user_museums"),
    where("user_id", "==", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as UserMuseumDoc);
}
