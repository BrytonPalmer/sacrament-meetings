export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Sacrament Meeting Planner
      </div>
    </footer>
  );
}