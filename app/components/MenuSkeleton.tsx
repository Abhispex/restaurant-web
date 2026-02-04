export default function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-5 h-[140px]"
        >
          <div className="rounded-xl bg-white/5 p-6 animate-pulse"/>
          <div className="h-40 w-full bg-white/10 rounded-lg mb-4" />
          <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
          <div className="h-3 w-full bg-white/10 rounded mb-4" />
          <div className="h-5 w-20 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}