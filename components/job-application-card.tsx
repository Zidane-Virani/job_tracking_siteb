import { JobApplication, Column } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";




interface JobApplicationCards {
    job: JobApplication;
    columns: Column[];
}

export default function JobApplicationCard( {job, columns} : JobApplicationCards ){

    return (
        <>
            <Card>
                <CardContent>
                    <div>
                        <div>
                            <h3>{job.position}</h3>
                            <p>{job.company}</p>
                            {job.description && <p> {job.description}</p>}
                            {job.tags && job.tags.length > 0 && (
                                <div>
                                    {job.tags.map((tag,key) => (
                                        <span key={key}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {job.jobUrl && (
                                <a target="_blank" href={job.jobUrl}> 
                                    <ExternalLink/>
                                </a>
                            )}
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant = "ghost" size = "icon">
                                        <MoreVertical></MoreVertical>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Edit2/>
                                        Edit
                                    </DropdownMenuItem>
                                    {columns.length > 1 && (
                                        <>
                                            {columns
                                                .filter((c) => c._id !== job.columnId)
                                                .map((column, key) => (
                                                    <DropdownMenuItem key={key}>
                                                        Move to {column.name}
                                                    </DropdownMenuItem>
                                                ))}
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
                
            </Card>
        </>
    )
}
