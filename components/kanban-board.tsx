"use client";
import { Board, Column, JobApplication } from "@/lib/models/models.types";
import { Calendar, CheckCircle2, Mic, Award, XCircle, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";
import CreateJobApplication from "./create-job";
import JobApplicationCard from "./job-application-card";
import {
    closestCorners,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";
import { updateJobApplication } from "@/lib/actions/job-applications";
import { useRouter } from "next/navigation";


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

const COLUMN_DROP_ID_PREFIX = "column-drop-";

function getColumnDropId(columnId: string) {
    return `${COLUMN_DROP_ID_PREFIX}${columnId}`;
}

function isColumnDropId(id: string) {
    return id.startsWith(COLUMN_DROP_ID_PREFIX);
}

function extractColumnIdFromDropId(dropId: string) {
    return dropId.replace(COLUMN_DROP_ID_PREFIX, "");
}

function normalizeColumns(columns: Column[]) {
    return [...columns]
        .sort((a, b) => a.order - b.order)
        .map((column) => ({
            ...column,
            jobApplications: [...(column.jobApplications || [])]
                .sort((a, b) => a.order - b.order)
                .map((job) => ({ ...job, columnId: column._id })),
        }));
}

function findColumnIdByJobId(columns: Column[], jobId: string) {
    const column = columns.find((currentColumn) =>
        currentColumn.jobApplications?.some((job) => job._id === jobId)
    );

    return column?._id;
}

interface MoveComputationResult {
    nextColumns: Column[];
    targetColumnId: string | null;
    targetOrder: number;
    changed: boolean;
}

function computeMove(
    columns: Column[],
    activeJobId: string,
    overId: string
): MoveComputationResult {
    const sourceColumnId = findColumnIdByJobId(columns, activeJobId);

    if (!sourceColumnId) {
        return { nextColumns: columns, targetColumnId: null, targetOrder: -1, changed: false };
    }

    const sourceColumn = columns.find((column) => column._id === sourceColumnId);
    if (!sourceColumn) {
        return { nextColumns: columns, targetColumnId: null, targetOrder: -1, changed: false };
    }

    const sourceJobs = [...(sourceColumn.jobApplications || [])];
    const sourceIndex = sourceJobs.findIndex((job) => job._id === activeJobId);

    if (sourceIndex === -1) {
        return { nextColumns: columns, targetColumnId: null, targetOrder: -1, changed: false };
    }

    const activeJob = sourceJobs[sourceIndex];

    let targetColumnId: string | null = null;
    let targetIndex = -1;

    if (isColumnDropId(overId)) {
        targetColumnId = extractColumnIdFromDropId(overId);
        const destinationColumn = columns.find((column) => column._id === targetColumnId);

        if (!destinationColumn) {
            return { nextColumns: columns, targetColumnId: null, targetOrder: -1, changed: false };
        }

        targetIndex = destinationColumn.jobApplications.length;
    } else {
        targetColumnId = findColumnIdByJobId(columns, overId) ?? null;
        if (!targetColumnId) {
            return { nextColumns: columns, targetColumnId: null, targetOrder: -1, changed: false };
        }

        const destinationColumn = columns.find((column) => column._id === targetColumnId);
        if (!destinationColumn) {
            return { nextColumns: columns, targetColumnId: null, targetOrder: -1, changed: false };
        }

        targetIndex = destinationColumn.jobApplications.findIndex((job) => job._id === overId);
        if (targetIndex === -1) {
            return { nextColumns: columns, targetColumnId: null, targetOrder: -1, changed: false };
        }
    }

    if (targetColumnId === sourceColumnId) {
        const nextIndex = isColumnDropId(overId) ? sourceJobs.length - 1 : targetIndex;
        if (nextIndex === sourceIndex) {
            return { nextColumns: columns, targetColumnId, targetOrder: nextIndex, changed: false };
        }

        const reorderedJobs = arrayMove(sourceJobs, sourceIndex, nextIndex).map((job, index) => ({
            ...job,
            columnId: sourceColumnId,
            order: index * 100,
        }));

        return {
            nextColumns: columns.map((column) =>
                column._id === sourceColumnId
                    ? { ...column, jobApplications: reorderedJobs }
                    : column
            ),
            targetColumnId,
            targetOrder: nextIndex,
            changed: true,
        };
    }

    const destinationColumn = columns.find((column) => column._id === targetColumnId);
    if (!destinationColumn) {
        return { nextColumns: columns, targetColumnId: null, targetOrder: -1, changed: false };
    }

    const sourceWithoutActive = sourceJobs.filter((job) => job._id !== activeJobId).map((job, index) => ({
        ...job,
        columnId: sourceColumnId,
        order: index * 100,
    }));
    const destinationJobs = [...(destinationColumn.jobApplications || [])];
    const clampedTargetIndex = Math.max(0, Math.min(targetIndex, destinationJobs.length));
    destinationJobs.splice(clampedTargetIndex, 0, {
        ...activeJob,
        columnId: targetColumnId,
    });

    const destinationWithNewOrders = destinationJobs.map((job, index) => ({
        ...job,
        columnId: targetColumnId ?? job.columnId,
        order: index * 100,
    }));

    return {
        nextColumns: columns.map((column) => {
            if (column._id === sourceColumnId) {
                return {
                    ...column,
                    jobApplications: sourceWithoutActive,
                };
            }

            if (column._id === targetColumnId) {
                return {
                    ...column,
                    jobApplications: destinationWithNewOrders,
                };
            }

            return column;
        }),
        targetColumnId,
        targetOrder: clampedTargetIndex,
        changed: true,
    };
}

function DroppableColumn({
    column,
    config,
    boardId,
    sortedColumns,
    onMove,
}: {
    column: Column;
    config: ColConfig;
    boardId: string;
    sortedColumns: Column[];
    onMove: (jobId: string, newColumnId: string) => Promise<void>;
}) {
    const sortedJobs = [...(column.jobApplications || [])].sort((a,b) => a.order - b.order);
    const { setNodeRef, isOver } = useDroppable({
        id: getColumnDropId(column._id),
    });

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
                <SortableContext items={sortedJobs.map((job) => job._id)} strategy={verticalListSortingStrategy}>
                    <div
                        ref={setNodeRef}
                        className={`mx-auto w-full max-w-[350px] space-y-3 rounded-md transition-colors ${
                            isOver ? "bg-slate-100/80 p-2" : ""
                        }`}
                    >
                        {sortedJobs.map((job) => (
                            <SortableJobCard
                                key={job._id}
                                job={{...job, columnId: column._id}}
                                columns={sortedColumns}
                                onMove={onMove}
                            />
                        ))}
                    </div>
                </SortableContext>
                <div className="mx-auto mt-auto w-full max-w-[350px] pt-1">
                    <CreateJobApplication columnId={column._id} boardId={boardId} />
                </div>
            </CardContent>
        </Card>
    )
}

function SortableJobCard({
    job,
    columns,
    onMove,
}: {
    job: JobApplication;
    columns: Column[];
    onMove: (jobId: string, newColumnId: string) => Promise<void>;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: job._id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={isDragging ? "opacity-40" : ""}
        >
            <JobApplicationCard job={job} columns={columns} onMove={onMove} />
        </div>
    )
}

export default function KanbanBoard({board}: KanbanBoardProps) {
    const router = useRouter();
    const [columns, setColumns] = useState<Column[]>(() => normalizeColumns(board?.columns ?? []));
    const [activeJobId, setActiveJobId] = useState<string | null>(null);

    useEffect(() => {
        // Keep optimistic client state in sync when server data changes after actions.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setColumns(normalizeColumns(board?.columns ?? []));
    }, [board]);

    const sortedColumns = useMemo(() => normalizeColumns(columns), [columns]);
    const activeJob = useMemo(
        () => sortedColumns.flatMap((column) => column.jobApplications || []).find((job) => job._id === activeJobId) ?? null,
        [activeJobId, sortedColumns]
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const applyMove = useCallback(
        async (jobId: string, overId: string) => {
            const moveResult = computeMove(columns, jobId, overId);
            if (!moveResult.changed || !moveResult.targetColumnId) {
                return;
            }

            setColumns(moveResult.nextColumns);

            const result = await updateJobApplication(jobId, {
                columnId: moveResult.targetColumnId,
                order: moveResult.targetOrder,
            });

            if (result?.error) {
                console.error("Failed to move job application:", result.error);
                router.refresh();
            }
        },
        [columns, router]
    );

    async function handleDragStart(event: DragStartEvent) {
        setActiveJobId(String(event.active.id));
    }

    async function handleDragEnd(event: DragEndEvent) {
        setActiveJobId(null);

        if (!event.over) {
            return;
        }

        const activeId = String(event.active.id);
        const overId = String(event.over.id);

        if (activeId === overId) {
            return;
        }

        await applyMove(activeId, overId);
    }

    async function handleMoveFromMenu(jobId: string, newColumnId: string) {
        await applyMove(jobId, getColumnDropId(newColumnId));
    }

    if (!board || !sortedColumns.length) {
        return (
            <div className="py-10 text-center text-gray-600">No columns yet</div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="w-full overflow-x-auto pb-4">
                <div className="flex items-stretch gap-5 px-2 py-1">
                    {sortedColumns.map((col, index) => {
                        const config = COLUMN_CONFIG[index] || COLUMN_CONFIG[0];
                        return (
                            <div key={col._id} className="flex flex-col">
                                <DroppableColumn
                                    column={col}
                                    config={config}
                                    boardId={board._id}
                                    sortedColumns={sortedColumns}
                                    onMove={handleMoveFromMenu}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <DragOverlay>
                {activeJob ? (
                    <Card className="w-[320px] overflow-hidden rounded-xl border-slate-200/80 bg-white py-0 shadow-[0_12px_28px_rgba(15,23,42,0.18)]">
                        <CardContent className="p-3">
                            <h3 className="truncate text-sm font-semibold text-slate-900">{activeJob.position}</h3>
                            <p className="truncate text-xs font-medium text-slate-600">{activeJob.company}</p>
                        </CardContent>
                    </Card>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
