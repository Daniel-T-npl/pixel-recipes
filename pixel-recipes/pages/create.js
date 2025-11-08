import Navbar from '../components/Navbar';
import ImageUploader from '../components/ImageUploader';
import { useUserData } from '../lib/hooks';
import { db, storage } from '../lib/firebase'; // Import services
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Firestore
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CreatePage() {
  const { user, username, loading } = useUserData();
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [software, setSoftware] = useState('');
  const [recipe, setRecipe] = useState('');
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  // Loading state for the submit button
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user && !loading) router.push('/enter');
  }, [user, loading, router]);

  // --- THE REAL SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation
    if (!beforeFile || !afterFile) {
        alert("Please upload both a 'Before' and 'After' image.");
        return;
    }

    setIsUploading(true); // Lock the form

    try {
        // 2. Define where to save images in Storage
        // We use Date.now() to make filenames unique
        const beforeRef = ref(storage, `uploads/${user.uid}/${Date.now()}-before-${beforeFile.name}`);
        const afterRef = ref(storage, `uploads/${user.uid}/${Date.now()}-after-${afterFile.name}`);

        // 3. Upload BOTH files in parallel (faster!)
        // We await both promises to finish
        const [beforeSnapshot, afterSnapshot] = await Promise.all([
            uploadBytes(beforeRef, beforeFile),
            uploadBytes(afterRef, afterFile)
        ]);

        // 4. Get the public download URLs for the uploaded files
        const beforeURL = await getDownloadURL(beforeSnapshot.ref);
        const afterURL = await getDownloadURL(afterSnapshot.ref);

        // 5. Save EVERYTHING to Firestore
        await addDoc(collection(db, "projects"), {
            title: title,
            software: software,
            recipe: recipe,
            beforeImage: beforeURL,
            afterImage: afterURL,
            uid: user.uid,                 // Who created it
            username: username || 'anon',  // Display name
            createdAt: serverTimestamp(),  // When it was created
        });

        // 6. Success! Redirect to home page.
        alert("Log published successfully!");
        router.push('/');

    } catch (error) {
        console.error("Error creating log:", error);
        alert(`Error: ${error.message}`);
        setIsUploading(false); // Unlock form so they can try again
    }
  };

  if (loading) return <main className="p-10">Loading...</main>;

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-20">
      <Navbar />
      <div className="max-w-screen-md mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Log</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">

            {/* Basic Info inputs... (same as before) */}
            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Project Title</label>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="e.g. Moody Urban Sunset" required value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Software Used</label>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="e.g. Lightroom" required value={software} onChange={(e) => setSoftware(e.target.value)} />
                </div>
            </div>

            {/* Image Uploaders... (same as before) */}
            <div className="grid gap-6 md:grid-cols-2">
                <ImageUploader label="Before Image (Raw)" onFileSelect={setBeforeFile} />
                <ImageUploader label="After Image (Final)" onFileSelect={setAfterFile} />
            </div>

            {/* Recipe Textarea... (same as before) */}
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">The Recipe (Markdown supported)</label>
                <textarea rows="8" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 font-mono" placeholder="1. Step one..." required value={recipe} onChange={(e) => setRecipe(e.target.value)}></textarea>
            </div>

            {/* Submit Button - NOW WITH LOADING STATE */}
            <button
                type="submit"
                disabled={isUploading}
                className={`text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-700 hover:bg-indigo-800'}`}
            >
                {isUploading ? 'Uploading...' : 'Publish Log'}
            </button>

        </form>
      </div>
    </main>
  );
}