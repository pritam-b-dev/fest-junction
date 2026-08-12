import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-5">
        <p className="text-7xl font-extrabold text-brand-primary">404</p>

        <h1 className="text-3xl font-bold text-white">Page Not Found</h1>

        <p className="text-slate-400 max-w-md">
          Sorry, the page you are looking for does not exist or may have been
          moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
