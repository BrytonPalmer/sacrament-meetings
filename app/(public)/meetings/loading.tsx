export default function MeetingsLoading() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading meetings">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 rounded-lg bg-gray-200" />
      ))}
    </div>
  );
}