import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
      <h1 className="text-6xl font-bold mb-4">
        <span className="text-terminal">404</span>
      </h1>
      <p className="text-lg text-muted mb-8">
        This page doesn&apos;t exist. But we can build you something that does.
      </p>
      <Link
        href="/"
        className="bg-terminal text-void px-6 py-3 rounded-lg text-sm font-bold hover:bg-terminal/90 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
