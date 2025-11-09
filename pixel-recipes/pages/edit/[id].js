import Navbar from '../../components/Navbar';
import { useUserData } from '../../lib/hooks';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EditPage() {
  const { user, loading } = useUserData();
  const router = useRouter();
  const { id } = router.query; // Get project ID from URL

  // Form State
  const [title, setTitle] = useState('');
  const [software, setSoftware] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 1. Fetch existing data when page loads
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Security Check: Ensure the logged-in user OWNS this post
        if (user && data.uid !== user.uid) {
            alert("You do not have permission to edit this.");
            router.push('/');
            return;
        }
        // Pre-fill form
        setTitle(data.title);
        setSoftware(data.software);
        setRecipe(data.recipe);
        setIsLoadingData(false);
      } else {
        alert("Project not found");
        router.push('/');
      }
    };

    // Only fetch once we know who the user is
    if (user && !loading) {
        fetchData();
    }
  }, [id, user, loading, router]);


  // 2. Protect route (must be logged in)
  useEffect(() => {
    if (!user && !loading) router.push('/enter');
  }, [user, loading, router]);


  // 3. Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
        const docRef = doc(db, "projects", id);
        // We ONLY update the text fields.
        // Updating images is too complex for now (requires re-uploading, deleting old files, etc.)
        await updateDoc(docRef, {
            title: title,
            software: software,
            recipe: recipe,
            // removed createdAt so it doesn't change the original date
        });

        alert("Log updated successfully!");
        router.push(`/project/${id}`); // Go back to the project page

    } catch (error) {
        console.error("Error updating log:", error);
        alert(`Error: ${error.message}`);
        setIsUpdating(false);
    }
  };

  if (loading || isLoadingData) return <main className="p-10 text-center">Loading...</main>;

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white pt-20 pb-20">
      <Navbar darkData={true} />
      <div className="max-w-screen-md mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-white">Edit Log</h1>
            <Link href={`/project/${id}`}>
                <span className="text-gray-300 hover:underline cursor-pointer">Cancel</span>
            </Link>
        </div>

        <form onSubmit={handleUpdate} className="bg-[#0b0b0b]/80 p-6 rounded-2xl shadow-xl border border-white/5 space-y-6 backdrop-blur-sm">

            {/* Notice to user */}
      <div className="bg-yellow-50/90 p-4 rounded-lg text-sm text-yellow-900 border border-yellow-200">
        NOTE: To change images, please delete this log and create a new one.
      </div>

            {/* Title & Software */}
            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
          <label className="block mb-2 text-sm font-medium text-gray-200">Project Title</label>
          <input type="text" className="bg-[#0f0f0f] border border-white/10 text-white text-sm rounded-lg block w-full p-2.5" required value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
          <label className="block mb-2 text-sm font-medium text-gray-200">Software Used</label>
          <input type="text" className="bg-[#0f0f0f] border border-white/10 text-white text-sm rounded-lg block w-full p-2.5" required value={software} onChange={(e) => setSoftware(e.target.value)} />
                </div>
            </div>

            {/* Recipe */}
            <div>
        <label className="block mb-2 text-sm font-medium text-gray-200">The Recipe</label>
        <textarea rows="10" className="block p-2.5 w-full text-sm text-white bg-[#0f0f0f] rounded-lg border border-white/10 font-mono" required value={recipe} onChange={(e) => setRecipe(e.target.value)}></textarea>
            </div>

            {/* Submit Button */}
      <button
        type="submit"
        disabled={isUpdating}
        className={`text-white font-semibold rounded-full text-sm w-full sm:w-auto px-6 py-3 text-center ${isUpdating ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}`}
      >
        {isUpdating ? 'Updating...' : 'Save Changes'}
      </button>

        </form>
      </div>
    </main>
  );
}