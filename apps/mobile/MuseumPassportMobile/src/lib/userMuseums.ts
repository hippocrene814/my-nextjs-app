import firestore from '@react-native-firebase/firestore';
import { UserMuseumDoc } from '@museum-app/shared/models/UserMuseum';

function encodeId(id: string) {
  return encodeURIComponent(id);
}

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
  const safeUserId = encodeId(userId);
  const safeMuseumId = encodeId(museumId);
  const docId = `${safeUserId}_${safeMuseumId}`;
  const ref = firestore().collection('user_museums').doc(docId);
  await ref.set(
    {
      user_id: userId,
      museum_id: museumId,
      visited: !!visited,
      wish: !!wish,
      notes: notes || '',
    },
    { merge: true }
  );
}

export async function getUserMuseum(userId: string, museumId: string): Promise<UserMuseumDoc | null> {
  const safeUserId = encodeId(userId);
  const safeMuseumId = encodeId(museumId);
  const docId = `${safeUserId}_${safeMuseumId}`;
  const ref = firestore().collection('user_museums').doc(docId);
  const snap = await ref.get();
  if (snap.exists) {
    return snap.data() as UserMuseumDoc;
  }
  return null;
}

export async function getAllUserMuseums(userId: string): Promise<UserMuseumDoc[]> {
  const snapshot = await firestore()
    .collection('user_museums')
    .where('user_id', '==', userId)
    .get();
  return snapshot.docs.map((doc: { data: () => unknown }) => doc.data() as UserMuseumDoc);
} 