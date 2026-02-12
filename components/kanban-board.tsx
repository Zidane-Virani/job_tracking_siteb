"use client";
import { Board, Column, JobApplication } from "@/lib/models/models.types";
import { Calendar, CheckCircle2, Mic, Award, XCircle, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";
import CreateJobApplication from "./create-job";
import JobApplicationCard from "./job-application-card";


interface KanbanBoardProps {
    board: Board | null;
}

interface ColConfig {
    headerClass: string;
    surfaceClass: string;
    icon: React.ReactNode;
}

const COLUMN_CONFIG: Array<ColConfig> = [
    {
      headerClass: "bg-cyan-500",
      surfaceClass: "border-sky-200/70",
      icon: <Calendar className="h-4 w-4 text-white/90" />,
    },
    {
      headerClass: "bg-purple-500",
      surfaceClass: "border-indigo-200/70",
      icon: <CheckCircle2 className="h-4 w-4 text-white/90" />,
    },
    {
      headerClass: "bg-green-500",
      surfaceClass: "border-emerald-200/70",
      icon: <Mic className="h-4 w-4 text-white/90" />,
    },
    {
      headerClass: "bg-yellow-500",
      surfaceClass: "border-amber-200/70",
      icon: <Award className="h-4 w-4 text-white/90" />,
    },
    {
      headerClass: "bg-red-500",
      surfaceClass: "border-rose-200/70",
      icon: <XCircle className="h-4 w-4 text-white/90" />,
    },
];

function DroppableColumn({column, config, boardId, sortedColumns}: {column: Column, config: ColConfig, boardId: string, sortedColumns: Column[]}) {
    const sortedJobs = [...(column.jobApplications || [])].sort((a,b) => a.order - b.order);
    return (
        <Card className={`flex h-full min-h-[calc(100vh-220px)] w-[340px] flex-col overflow-hidden rounded-xl border py-0 gap-0 shadow-sm ${config.surfaceClass}`}>
            <CardHeader className={`px-4 py-3 ${config.headerClass}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {config.icon}
                        <CardTitle className="text-sm font-semibold tracking-wide text-white">
                            {column.name}
                        </CardTitle>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-7 w-7 rounded-full p-0 text-white hover:bg-white/20 hover:text-white">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Column
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-3 p-3">
                <div className="mx-auto w-full max-w-[350px] space-y-3">
                    {sortedJobs.map((job) => (
                        <SortableJobCard key={job._id}
                            job={{...job, columnId: column._id}}
                            columns={sortedColumns}
                        />
                    ))}
                </div>
                <div className="mx-auto mt-auto w-full max-w-[350px] pt-1">
                    <CreateJobApplication columnId={column._id} boardId={boardId} />
                </div>
            </CardContent>
        </Card>
    )
}

function SortableJobCard({job, columns}: {job: JobApplication, columns: Column[]}) {
    return (
        <JobApplicationCard job={job} columns={columns} />
    )
}

export default function KanbanBoard({board}: KanbanBoardProps) {
    const columns = board?.columns ?? [];
    const sortedColumns = [...columns].sort((a,b) => a.order - b.order);

    if (!board || !sortedColumns.length) {
        return (
            <div className="py-10 text-center text-gray-600">No columns yet</div>
        );
    }

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="flex items-stretch gap-5 px-2 py-1">
                {sortedColumns.map((col, index) => {
                    const config = COLUMN_CONFIG[index] || COLUMN_CONFIG[0];
                    return (
                        <div key={col._id} className="flex flex-col">
                            <DroppableColumn column={col} config={config} boardId={board._id} sortedColumns={sortedColumns} />
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
