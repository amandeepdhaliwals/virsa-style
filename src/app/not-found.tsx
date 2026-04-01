import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-light px-4">
      <div className="text-center">
        <p className="font-serif text-8xl text-pastel-rose mb-4">404</p>
        <h1 className="font-serif text-3xl text-luxury-dark mb-3">Page Not Found</h1>
        <p className="text-luxury-text/60 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-luxury">Go Home</Link>
          <Link href="/shop" className="btn-outline-luxury">Shop Now</Link>
        </div>
      </div>
    </div>
  );
}
