import Link from 'next/link';

export default function ProjectCard({ project }) {
  return (
    <Link href={`/project/${project.id}`}>
      <div className="cursor-pointer group">
        <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 mb-4 relative">
            {/* Show the 'After' image as the thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={project.afterImage}
                alt={project.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
            />
        </div>
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {project.title}
        </h3>
        <p className="text-sm text-gray-500">
            by <span className="font-medium">{project.username}</span>
        </p>
      </div>
    </Link>
  );
}