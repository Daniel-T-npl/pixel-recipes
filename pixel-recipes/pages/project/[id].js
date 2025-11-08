import Navbar from '../../components/Navbar';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
// Import the slider component.
// NOTE: We might need to dynamically import this if it causes issues with server-side rendering,
// but let's try the simple way first.
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';

export default function ProjectPage({ project }) {
  if (!project) {
      return <main className="pt-20 text-center">Project not found.</main>;
  }

  // Slider setup
  const FIRST_IMAGE = { imageUrl: project.beforeImage };
  const SECOND_IMAGE = { imageUrl: project.afterImage };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* 1. The Hero Section (Title & Artist) */}
      <div className="pt-24 pb-10 px-4 max-w-screen-xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {project.title}
        </h1>
        <p className="text-xl text-gray-500">
            Created by <span className="font-semibold text-indigo-600">{project.username}</span>
            {' • '}
            <span className="text-gray-400">{project.software}</span>
        </p>
      </div>

      {/* 2. THE WOW FACTOR: Comparison Slider */}
      <div className="w-full max-w-4xl mx-auto mb-16 px-4">
          {/* We wrap it in a div to control max width */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
             <ReactBeforeSliderComponent
                firstImage={FIRST_IMAGE}
                secondImage={SECOND_IMAGE}
                currentPercentPosition={50} // Start in the middle
                delimiterColor="#4F46E5"   // Indigo dividing line
             />
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-400 mt-2 px-4">
              <p>BEFORE (Raw)</p>
              <p>AFTER (Final)</p>
          </div>
      </div>

      {/* 3. The Recipe Section */}
      <div className="max-w-screen-md mx-auto px-4 pb-24">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-4">
                    📝
                  </span>
                  The Recipe
              </h2>
              {/* React Markdown renders the text nicely */}
              <article className="prose prose-indigo max-w-none">
                  <ReactMarkdown>
                      {project.recipe}
                  </ReactMarkdown>
              </article>
          </div>
      </div>

    </main>
  );
}

// Fetch data on the server before rendering
export async function getServerSideProps(context) {
    const { id } = context.params; // Get the ID from the URL
    try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // Must convert timestamp to number for Next.js
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

    // If not found or error, return null project
    return { props: { project: null } };
}