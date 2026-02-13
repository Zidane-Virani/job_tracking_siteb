
import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import KanbanBoard from "@/components/kanban-board";
import { Suspense } from "react";


async function getBoard(userId: string) {
    "use cache";

    await connectDB();

    const boardDoc = await Board.findOne( { 
        userId: userId,
        name: "Job Applications"
    }).populate({
        path: "columns",
        populate: {
            path: "jobApplications"
        }
    })
    if (!boardDoc) return null;

    return JSON.parse(JSON.stringify(boardDoc.toObject()));

}

async function DashBoardPage(){
    const session = await getSession();
    const board = await getBoard(session?.user?.id ?? "");

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <div className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-10">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-black">{board?.name}</h1>
                    {board?.description && (
                        <p className="mt-2 text-gray-500">{board.description}</p>
                    )}
                </div>
                <div className="flex flex-1">
                    <KanbanBoard board={board} />
                </div>
            </div>
        </div>
    )

}

export default async function Dashboard() {

    return <Suspense fallback={<div>Loading...</div>}> <DashBoardPage/></Suspense>
    
}
