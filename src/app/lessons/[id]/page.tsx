type LessonStep = {
  id: number;
  agentPromptB: string;
  targetPhraseA: string;
};

type Lesson = {
  id: number;
  title: string;
  description: string;
  steps: LessonStep[];
};

async function getLesson(id: string): Promise<Lesson> {
  const res = await fetch(`http://localhost:3000/api/lessons/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch lesson');
  }
  return res.json();
}

export default async function LessonPage({ params }: { params: { id: string } }) {
  const lesson = await getLesson(params.id);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-lg text-gray-400 mb-8">{lesson.description}</p>

        <div className="space-y-4">
          {lesson.steps.map((step) => (
            <div key={step.id} className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
              <p className="font-semibold text-white">Agent: <span className="font-normal text-gray-300">{step.agentPromptB}</span></p>
              <p className="font-semibold text-white">You should say: <span className="font-normal text-green-400">{step.targetPhraseA}</span></p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
                Push to Talk
            </button>
        </div>
      </div>
    </main>
  );
}