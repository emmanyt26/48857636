import { prisma } from "@/lib/db";
import IDCardComponent from "./id-card";

export default async function IDPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const official = await prisma.sKOfficial.findUnique({
    where: {
      id,
    },
  });

  if (!official) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">ID Not Found</h1>
          <p>The SK Official ID you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <IDCardComponent official={official} />
    </div>
  );
}