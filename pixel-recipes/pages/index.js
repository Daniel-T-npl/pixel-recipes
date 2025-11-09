import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function Home({ projects = [] }) {
  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Navbar darkData={true} />

      {/* 1. Sticky Hero Section */}
      {/* 'sticky top-0' keeps it at the top of the viewport while we scroll past it */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 text-center z-0">
        <h1 className="text-5xl md:text-9xl font-black text-white tracking-tighter mb-6 leading-none">
          SEE WHAT<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
            EDITING
          </span><br />
          CAN DO.
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl max-w-xl animate-pulse">
            Scroll to discover ↓
        </p>
      </div>

      {/* 2. The Gallery (Covers the Hero) */}
      {/* 'relative z-10' ensures it slides ON TOP of the sticky hero */}
      {/* 'bg-[#0f0f0f]' ensures it's opaque and actually covers the text */}
      {/* 'min-h-screen' ensures it's tall enough to fully cover */}
      <div className="relative z-10 bg-[#0f0f0f] min-h-screen pt-20 px-4 pb-20 rounded-t-3xl shadow-[0_-20px_60px_-15px_rgba(0,0,0,1)]">

        <div className="max-w-screen-xl mx-auto">
            <h2 className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-8 text-center">
                Latest Community Recipes
            </h2>

            {/* MASONRY GRID LAYOUT */}
            {/* columns-1, columns-2, etc. creates the Pinterest style layout */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>

      </div>
    </main>
  );
}

// ... getServerSideProps remains the same ...
export async function getServerSideProps() {
    const projects = [];
    try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            projects.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toMillis() || 0,
            });
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
    return { props: { projects } };
}