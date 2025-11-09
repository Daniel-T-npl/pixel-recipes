import Navbar from '../../components/Navbar';
import { db } from '../../lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';
import { useUserData } from '../../lib/hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ProjectPage({ project }) {
  const { user } = useUserData();
  const router = useRouter();
  const [isComparing, setIsComparing] = useState(false);
  // Start at 0% (Before image)
  const [sliderPosition, setSliderPosition] = useState(0);

  // Animation effect when comparison starts
  useEffect(() => {
    if (isComparing) {
        let animationFrameId;
        let startTimestamp = null;
        const duration = 2000; // 1.5 seconds for the full sweep

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = timestamp - startTimestamp;
            // Calculate percentage based on time passed
            const percent = Math.min((progress / duration) * 100, 100);

            setSliderPosition(percent);

            if (progress < duration) {
                animationFrameId = window.requestAnimationFrame(step);
            }
        };

        // Start the animation
        animationFrameId = window.requestAnimationFrame(step);

        // Cleanup if component unmounts mid-animation
        return () => window.cancelAnimationFrame(animationFrameId);
    }
  }, [isComparing]);

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
      <div className="pt-32 pb-8 px-4 max-w-screen-xl mx-auto text-center relative">
        {/* --- OWNER CONTROLS --- */}
        {user && user.uid === project.uid && (
            <div className="absolute top-24 right-4 flex gap-2">
                <Link href={`/edit/${project.id}`}>
                    <button className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold hover:bg-indigo-500 hover:text-white transition-colors">
                        EDIT
                    </button>
                </Link>
                <button
                    onClick={handleDelete}
                    className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-colors"
                >
                    DELETE
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
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
                {(project.username && project.username[0]) ? project.username[0].toUpperCase() : '?'}
            </div>
            <p className="text-lg text-gray-300">
                by <span className="font-semibold text-white">{project.username || 'Anonymous'}</span>
            </p>
        </div>
      </div>

      {/* 2. WOW Slider (Click-to-Activate + Auto-Sweep) */}
      <div className="w-full max-w-2xl mx-auto mb-20 px-4">
          <div className="rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0a0a0a]">

             {!isComparing ? (
                // STATE 1: Static Image
                <div
                    className="relative cursor-pointer group"
                    onClick={() => setIsComparing(true)}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={SECOND_IMAGE.imageUrl}
                        alt="Final Result"
                        className="w-full h-auto"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>
                            <span className="font-bold tracking-wider text-sm">CLICK TO COMPARE</span>
                        </div>
                    </div>
                </div>
             ) : (
                // STATE 2: Active Slider with Auto-Sweep
                <div className="animate-fadeIn">
                    <ReactBeforeSliderComponent
                        firstImage={FIRST_IMAGE}
                        secondImage={SECOND_IMAGE}
                        currentPercentPosition={sliderPosition} // Controlled by state now
                        delimiterColor="#6366F1"
                    />
                </div>
             )}

          </div>

          {/* Helper text below */}
           <div className={`flex justify-between text-xs font-bold tracking-widest text-gray-500 mt-4 px-2 transition-opacity duration-500 ${isComparing ? 'opacity-100' : 'opacity-0'}`}>
              <p>FINAL // AFTER</p>
              <p>RAW // BEFORE</p>
          </div>
      </div>

      {/* 3. Recipe Section */}
      <div className="max-w-screen-md mx-auto px-4 pb-32">
          <div className="bg-[#1a1a1a] rounded-3xl p-8 md:p-12 border border-white/5 shadow-xl">
              <h2 className="text-2xl font-bold mb-8 flex items-center text-white">
                  <span className="text-indigo-400 mr-3">#</span>
                  The Recipe 
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