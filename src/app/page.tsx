import Link from 'next/link';

type Lesson = {
  id: number;
  title: string;
  description: string;
};

async function getLessons(): Promise<Lesson[]> {
  // Use a relative path for the API call, which works in both dev and prod.
  // The `fetch` in a Server Component on the server will call the API route.
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/lessons`, { cache: 'no-store' });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch lessons');
  }
  return res.json();
}

export default async function HomePage() {
  const lessons = await getLessons();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Language Tutor</h1>
      </div>
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-semibold mb-4">Choose a Lesson</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="block p-6 bg-gray-800 border border-gray-700 rounded-lg shadow hover:bg-gray-700">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{lesson.title}</h5>
              <p className="font-normal text-gray-400">{lesson.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}