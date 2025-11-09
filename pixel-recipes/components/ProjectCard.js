import Link from 'next/link';

export default function ProjectCard({ project }) {
  return (
    <Link href={`/project/${project.id}`}>
      {/* ADDED: 'relative z-10 bg-[#0f0f0f]' to ensure it sits ON TOP of the glow */}
      <div className="relative z-10 bg-[#0f0f0f] mb-6 break-inside-avoid rounded-xl overflow-hidden cursor-pointer group shadow-2xl">
        {/* Background Image - let it determine height */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
            src={project.afterImage}
            alt={project.title}
            className="w-full h-auto transition-transform duration-700 ease-in-out group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Text Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">{project.software}</p>
            <h3 className="text-lg font-bold text-white leading-tight">{project.title}</h3>
            <p className="text-xs text-gray-300 mt-1">by {project.username}</p>
        </div>
      </div>
    </Link>
  );
}