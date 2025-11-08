import { auth, db } from '../lib/firebase'; // Assuming db is exported from firebase.js
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

// Custom hook to read auth record and user profile doc
export function useUserData() {
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState(null); // 'username' is just an example

  useEffect(() => {
    // We'll skip creating a username doc for now to save time
    // but this is where you would fetch it from Firestore.
    if (user) {
      // For the hackathon, we'll just use the first part of their email.
      const simpleUsername = user.email.split('@')[0];
      setUsername(simpleUsername);
    } else {
      setUsername(null);
    }

  }, [user]);

  return { user, username, loading }; // Return loading state as well
}