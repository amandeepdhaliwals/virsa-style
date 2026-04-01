export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-8 w-48 bg-pastel-pink/50 animate-pulse mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-pastel-pink/30 mb-3" />
            <div className="h-3 w-20 bg-pastel-pink/30 mb-2" />
            <div className="h-4 w-32 bg-pastel-pink/30 mb-2" />
            <div className="h-3 w-16 bg-pastel-pink/30" />
          </div>
        ))}
      </div>
    </div>
  );
}
