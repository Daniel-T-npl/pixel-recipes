import Navbar from '../../components/Navbar';
import { db } from '../../lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';
import { useUserData } from '../../lib/hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ProjectPage({ project }) {
  // --- MOVED THESE HOOKS TO THE TOP ---
  const { user } = useUserData();
  const router = useRouter();

  if (!project) return <main className="pt-20 text-center text-white bg-[#0f0f0f] min-h-screen">Project not found.</main>;

  const FIRST_IMAGE = { imageUrl: project.beforeImage };
  const SECOND_IMAGE = { imageUrl: project.afterImage };

  const handleDelete = async () => {
      const confirmed = window.confirm("Are you sure you want to delete this log? This cannot be undone.");
      if (confirmed) {
          try {
              await deleteDoc(doc(db, "projects", project.id));
              alert("Log deleted.");
              router.push('/');
          } catch (error) {
              alert("Error deleting: " + error.message);
          }
      }
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar darkData={true} />

      {/* 1. Hero Section */}
      <div className="pt-32 pb-10 px-4 max-w-screen-xl mx-auto text-center relative">
        {/* --- OWNER CONTROLS (Only visible to owner) --- */}
        {user && user.uid === project.uid && (
            <div className="absolute top-24 right-4">
                <Link href={`/edit/${project.id}`}>
                    <button className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold hover:bg-indigo-500 hover:text-white transition-colors">
                        EDIT
                    </button>
                </Link>
                <button
                    onClick={handleDelete}
                    className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-colors"
                >
                    DELETE LOG
                </button>
            </div>
            
        )}

        <p className="text-indigo-400 font-mono text-sm mb-4 tracking-widest uppercase">
            {project.software}
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            {project.title}
        </h1>
        <div className="flex items-center justify-center gap-3">
            {/* Handle username safely in case it's missing */}
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
                {(project.username && project.username[0]) ? project.username[0].toUpperCase() : '?'}
            </div>
            <p className="text-lg text-gray-300">
                by <span className="font-semibold text-white">{project.username || 'Anonymous'}</span>
            </p>
        </div>
      </div>

      {/* 2. WOW Slider */}
      <div className="w-full max-w-5xl mx-auto mb-20 px-4">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
             <ReactBeforeSliderComponent
                firstImage={SECOND_IMAGE}
                secondImage={FIRST_IMAGE}
                currentPercentPosition={50}
                delimiterColor="#4F46E5"
             />
          </div>
           <div className="flex justify-between text-xs font-bold tracking-widest text-gray-500 mt-4 px-2">
              <p>RAW // BEFORE</p>
              <p>FINAL // AFTER</p>
          </div>
      </div>

      {/* 3. Recipe Section - Dark Mode */}
      <div className="max-w-screen-md mx-auto px-4 pb-32">
          <div className="bg-[#1a1a1a] rounded-3xl p-8 md:p-12 border border-white/5 shadow-xl">
              <h2 className="text-2xl font-bold mb-8 flex items-center text-white">
                  <span className="text-indigo-400 mr-3">#</span>
                  The Recipe Process
              </h2>
              <article className="prose prose-invert prose-indigo max-w-none prose-lg prose-headings:font-bold prose-a:text-indigo-400">
                  <ReactMarkdown>
                      {project.recipe}
                  </ReactMarkdown>
              </article>
          </div>
      </div>

    </main>
  );
}

export async function getServerSideProps(context) {
    const { id } = context.params;
    try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const project = {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toMillis() || 0,
            };
            return { props: { project } };
        }
    } catch (error) {
        console.error("Error fetching project:", error);
    }
    return { props: { project: null } };
}