import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function Home({ projects = [] }) {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      <div className="max-w-screen-xl mx-auto p-4">

        {/* Hero Section */}
        <div className="text-center py-12 md:py-20">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Discover Creative <span className="text-indigo-600">Recipes</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
              Don't just see the result. See the process. Explore before-and-after transformations and learn exactly how they were made.
            </p>
            {/* Call to Action */}
            <div className="flex justify-center gap-4">
                 <a href="/create" className="text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-lg px-6 py-3">
                    Share Your Work
                 </a>
            </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>

        {/* Empty State (if no projects exist yet) */}
        {projects.length === 0 && (
            <div className="text-center text-gray-500 py-20">
                No projects yet. Be the first to post!
            </div>
        )}

      </div>
    </main>
  );
}

// This function runs on the SERVER every time the page is requested.
export async function getServerSideProps() {
    const projects = [];
    try {
        // Query the 'projects' collection, order by newest first, limit to 20
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            // We must convert Firestore timestamps to regular strings/numbers
            // because Next.js can't serialize complex objects to JSON.
            const data = doc.data();
            projects.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toMillis() || 0, // Safe timestamp conversion
            });
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        // In a real app we might handle this better, but for now just return empty array
    }

    return {
        props: { projects }, // Will be passed to the Home component as props
    };
}