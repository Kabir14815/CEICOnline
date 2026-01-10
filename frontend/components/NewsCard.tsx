import Link from 'next/link';

interface NewsCardProps {
  title: string;
  slug: string;
  category: string;
  cover_image_url?: string;
  created_at: string;
}

export default function NewsCard({ title, slug, category, cover_image_url, created_at }: NewsCardProps) {
  return (
    <Link href={`/news/${slug}`} className="group block h-full">
      <div className="bg-white border-b border-gray-200 pb-4 h-full flex flex-col relative hover:shadow-lg transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden mb-3">
          {cover_image_url ? (
            <img
              src={cover_image_url}
              alt={title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-2xl font-bold opacity-50">EDU News</span>
            </div>
          )}

          {/* Badge - Bottom Left */}
          <span className="absolute bottom-0 left-0 bg-[#A855F7] text-white text-[10px] font-bold uppercase px-3 py-1 z-10">
            {category}
          </span>
        </div>

        {/* Content */}
        <div className="px-1 flex flex-col flex-grow">
          <h2 className="text-lg font-black text-[#111827] mb-2 line-clamp-2 uppercase leading-tight group-hover:text-[#A855F7] transition-colors duration-300">
            {title}
          </h2>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            Latest update on {title} regarding {category}. Check the full details here.
          </p>

          <div className="mt-auto pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium uppercase">
              {new Date(created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
