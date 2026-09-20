export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-4 rounded bg-yellow-50 border border-yellow-200 px-3 py-2 text-sm text-yellow-800">
        Admin area — authentication will be added in Week 05.
      </div>
      {children}
    </div>
  );
}