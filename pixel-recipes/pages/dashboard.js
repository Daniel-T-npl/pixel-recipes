import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { useUserData } from '../lib/hooks';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useUserData();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    // 1. Redirect if not logged in
    if (!authLoading && !user) {
        router.push('/enter');
        return;
    }

    // 2. Fetch user's projects in real-time
    let unsubscribe;
    if (user) {
        const q = query(
            collection(db, "projects"),
            where("uid", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        unsubscribe = onSnapshot(q, (snapshot) => {
            const userProjects = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(userProjects);
            setLoadingProjects(false); // This MUST run, even if snapshot is empty
        }, (error) => {
            console.error("Error fetching dashboard projects:", error);
            setLoadingProjects(false); // Ensure we don't get stuck on loading if error
        });
    }

    return () => unsubscribe && unsubscribe();
  }, [user, authLoading, router]);

  // Show loading ONLY if we are truly waiting for something
  if (authLoading || (loadingProjects && user)) {
      return <main className="min-h-screen bg-[#0f0f0f] pt-24 text-center text-white">Loading your work...</main>;
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Navbar darkData={true} />
      <div className="max-w-screen-xl mx-auto p-4 pt-24">
        <h1 className="text-3xl font-bold text-white mb-8">My Logs</h1>

        {/* Reuse our Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>

        {/* Empty State */}
        {!loadingProjects && projects.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                You haven't published any logs yet.
                <br />
                <Link href="/create">
                    <span className="text-indigo-400 font-bold cursor-pointer hover:underline mt-4 inline-block">
                        Create your first one now
                    </span>
                </Link>
            </div>
        )}
      </div>
    </main>
  );
}