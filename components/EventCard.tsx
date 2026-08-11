import Link from "next/link";
import { FiCalendar, FiTag, FiArrowRight } from "react-icons/fi";

export interface EventCardProps {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  startDate: string;
  price: number;
  imageUrl?: string;
}

export default function EventCard({
  slug,
  title,
  categoryName,
  startDate,
  price,
  imageUrl,
}: EventCardProps) {
  const formattedDate = new Date(startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-brand-primary/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-violet-950/30">
      <div>
        <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
          <img
            src={
              imageUrl ||
              "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
            }
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-brand-accent flex items-center gap-1.5 border border-amber-500/20">
            <FiTag className="w-3 h-3" />
            <span>{categoryName}</span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <FiCalendar className="text-brand-primary w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>

          <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-accent transition-colors line-clamp-2">
            {title}
          </h3>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 flex items-center justify-between mt-auto">
        <div>
          <span className="text-xs text-slate-500 block">Price</span>
          <span className="font-display font-bold text-lg text-white">
            {price === 0 ? "Free" : `$${price}`}
          </span>
        </div>

        <Link
          href={`/events/${slug}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-brand-primary transition-colors group/btn"
        >
          <span>View Details</span>
          <FiArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
