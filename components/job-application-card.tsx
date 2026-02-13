"use client";

import { JobApplication, Column } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { updateJobApplication } from "@/lib/actions/job-applications";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { useState } from "react";
import EditJobApplication from "./edit-job";

interface JobApplicationCards {
    job: JobApplication;
    columns: Column[];
    onMove?: (jobId: string, newColumnId: string) => Promise<void>;
}

export default function JobApplicationCard( {job, columns, onMove} : JobApplicationCards ){
    const [editOpen, setEditOpen] = useState(false);
    const moveTargets = columns.filter((c) => c._id !== job.columnId);

    async function handleMove(newColumnId: string) {
        try {
            if (onMove) {
                await onMove(job._id, newColumnId);
                return;
            }

            const result = await updateJobApplication(job._id, {
                columnId: newColumnId,
            });

            if (result?.error) {
                console.error("Failed to move job application:", result.error);
            }
        } catch (err) {
            console.error("Failed to move job application:", err);
        }
    }


    return (
        <>
            <Card className="overflow-hidden rounded-xl border-slate-200/80 bg-white py-0 shadow-[0_6px_20px_rgba(15,23,42,0.05)] transition-all duration-200 hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.1)]">
                <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-semibold text-slate-900">{job.position}</h3>
                            <p className="truncate text-xs font-medium text-slate-600">{job.company}</p>
                            {job.description && (
                                <p className="mt-2 text-xs leading-5 text-slate-600">{job.description}</p>
                            )}
                            {job.tags && job.tags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {job.tags.map((tag,key) => (
                                        <span key={`${tag}-${key}`} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {job.jobUrl && (
                                <a
                                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-800"
                                    target="_blank"
                                    rel="noreferrer"
                                    href={job.jobUrl}
                                >
                                    <ExternalLink className="h-3.5 w-3.5"/>
                                    View listing
                                </a>
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant = "ghost" size = "icon-xs" className="rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2" onClick={() => setEditOpen(true)}>
                                    <Edit2 className="h-3.5 w-3.5"/>
                                    Edit
                                </DropdownMenuItem>
                                {moveTargets.length > 0 && moveTargets.map((column, key) => (
                                    <DropdownMenuItem key={key} onClick={() => handleMove(column._id)} >
                                        Move to {column.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>
            <EditJobApplication job={job} open={editOpen} onOpenChange={setEditOpen} />
        </>
    )
}
