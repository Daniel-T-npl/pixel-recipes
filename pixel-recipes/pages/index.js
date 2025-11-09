import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 12; // number of items to load per page

export default function Home({ projects: initialProjects = [] }) {
  const [projects, setProjects] = useState(initialProjects || []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState((initialProjects || []).length >= PAGE_SIZE);
  const observerRef = useRef();

  // Load more projects when sentinel becomes visible
  useEffect(() => {
    if (!hasMore) return;
    const sentinel = observerRef.current;
    if (!sentinel) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loadingMore) {
          loadMore();
        }
      });
    }, { rootMargin: '400px' });

    io.observe(sentinel);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore]);

  // Fetch next page from Firestore
  const loadMore = async () => {
    if (loadingMore) return;
    if (!hasMore) return;
    const last = projects[projects.length - 1];
    if (!last || !last.createdAt) {
      setHasMore(false);
      return;
    }

    setLoadingMore(true);
    try {
      const lastTs = Timestamp.fromMillis(last.createdAt);
      // For descending order, fetch documents older than the last createdAt
      const q = query(
        collection(db, 'projects'),
        orderBy('createdAt', 'desc'),
        where('createdAt', '<', lastTs),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);
      const next = [];
      snap.forEach((doc) => {
        const data = doc.data();
        next.push({ id: doc.id, ...data, createdAt: data.createdAt?.toMillis() || 0 });
      });

      if (next.length > 0) {
        setProjects((p) => [...p, ...next]);
      }
      if (next.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      console.error('Error loading more projects:', err);
      // stop attempting further loads on error
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Navbar darkData={true} isDynamicHome={true} />

      {/* 1. Sticky Hero Section */}
      {/* 'sticky top-0' keeps it at the top of the viewport while we scroll past it */}
  <div id="hero" className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 text-center z-0">
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
  <div id="gallery" className="relative z-10 bg-[#0f0f0f] min-h-screen pt-20 px-4 pb-20 rounded-t-3xl shadow-[0_-20px_60px_-15px_rgba(0,0,0,1)]">

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

            {/* Loading / sentinel */}
            <div className="mt-6 text-center">
              {loadingMore && <div className="text-gray-400">Loading more…</div>}
              {!hasMore && <div className="text-gray-500">No more projects.</div>}
              {/* sentinel div observed by IntersectionObserver */}
              <div ref={observerRef} className="w-full h-2" />
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