export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-pastel-pink border-t-accent rounded-full animate-spin" />
        <p className="text-xs tracking-[0.3em] uppercase text-luxury-text/40">Loading</p>
      </div>
    </div>
  );
}
