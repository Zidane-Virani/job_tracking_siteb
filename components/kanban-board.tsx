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
    board: Board;
    userId: string;
}

interface ColConfig {
    color: string;
    icon: React.ReactNode;
  }
  const COLUMN_CONFIG: Array<ColConfig> = [
    {
      color: "bg-cyan-500",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      color: "bg-purple-500",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
      color: "bg-green-500",
      icon: <Mic className="h-4 w-4" />,
    },
    {
      color: "bg-yellow-500",
      icon: <Award className="h-4 w-4" />,
    },
    {
      color: "bg-red-500",
      icon: <XCircle className="h-4 w-4" />,
    },
  ];

function DroppableColumn({column, config, boardId, sortedColumns}: {column: Column, config: ColConfig, boardId: string, sortedColumns: Column[]}) {
    const sortedJobs = column.jobApplications.sort((a,b) => a.order - b.order) || [];   
    return (
        <Card className="flex-1 min-w-[220px] border border-gray-200 rounded-lg overflow-hidden py-0 gap-0">
            <CardHeader className={`${config.color} text-white px-4 py-3`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {config.icon}
                        <CardTitle className="text-sm font-semibold text-white">
                            {column.name}
                        </CardTitle>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-6 w-6 p-0 text-white hover:bg-white/20">
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

            <CardContent className="p-3 min-h-[200px]">
                {sortedJobs.map((job, key) => (
                    <SortableJobCard key={key} 
                        job={{...job, columnId: column._id}}
                        columns={sortedColumns}
                    />
                ))}

                <CreateJobApplication columnId={column._id} boardId={boardId} />

            </CardContent>
        </Card>
    )
}

function SortableJobCard({job, columns}: {job: JobApplication, columns: Column[]}) {
    return (
        <JobApplicationCard job={job} columns={columns} />
    )
}

export default function KanbanBoard({board, userId}: KanbanBoardProps) {
    const columns = board.columns;
    const sortedColumns = columns.sort((a,b) => a.order - b.order) || [];
    return (
        <>
            <div className="overflow-x-auto">
                <div className="flex gap-4">
                    {columns.map((col, index) => {
                        const config = COLUMN_CONFIG[index] || COLUMN_CONFIG[0];
                        return <DroppableColumn key={col._id} column={col} config={config} boardId={board._id} sortedColumns={sortedColumns} />;
                    })}
                </div>
            </div>
        </>
    )
}
