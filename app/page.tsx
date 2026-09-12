import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Sacrament Meeting Planner</h1>
      <p className="text-lg text-gray-700 mb-8">
        Plan, manage, and review sacrament meeting agendas for your ward — hymns, speakers,
        prayers, and ward business, all in one place.
      </p>
      <Image
        src="/next.svg"
        alt="Sacrament Meeting Planner illustration"
        width={200}
        height={100}
        className="mx-auto"
      />
    </div>
  );
}