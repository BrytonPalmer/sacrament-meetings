import NavLinks from "@/components/NavLinks";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="mb-6 pb-4 border-b">
        <NavLinks />
      </nav>
      {children}
    </div>
  );
}