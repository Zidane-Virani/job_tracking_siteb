"use client";

import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { createJobApplication } from "@/lib/actions/job-applications";

interface CreateJobApplicationProps {
    columnId: string;
    boardId: string;
}

const initialFormData = {
    company: "",
    position: "",
    location: "",
    notes: "",
    salary: "",
    jobUrl: "",
    tags: "",
    description: "",
}


export default function CreateJobApplication({columnId, boardId}: CreateJobApplicationProps) 

        
{
    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        company: "",
        position: "",
        location: "",
        notes: "",
        salary: "",
        jobUrl: "",
        tags: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const result = await createJobApplication({
                ...formData,
                columnId,
                boardId,
                tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
            });

            if (!result.error) {
                setFormData(initialFormData);
                setOpen(false);
            } else {
                console.error("Failed to create a job application", result.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open = {open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-9 w-full justify-center rounded-lg border-dashed border-slate-300 bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900">
                    <Plus />
                    Add application
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Job Application</DialogTitle>
                    <DialogDescription>Track a new job application</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="company">Company *</Label>
                                <Input id="company" required onChange={(e) => setFormData({...formData, company: e.target.value})} value={formData.company} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="position">Position *</Label>
                                <Input id="position" required onChange={(e) => setFormData({...formData, position: e.target.value})} value={formData.position} />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" onChange={(e) => setFormData({...formData, location: e.target.value})} value={formData.location} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input id="salary" type="number" min="0" placeholder="e.g - $100k - $120k" onChange={(e) => setFormData({...formData, salary: e.target.value})} value={formData.salary} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jobURL">Job URL</Label>
                            <Input id="jobUrl" type="url" placeholder="https://company.com/careers/job-id" onChange={(e) => setFormData({...formData, jobUrl: e.target.value})} value={formData.jobUrl} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" type="text" placeholder="Short job description (optional)" onChange={(e) => setFormData({...formData, description: e.target.value})} value={formData.description} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input id="notes" type="text" placeholder="Any additional notes (optional)" onChange={(e) => setFormData({...formData, notes: e.target.value})} value={formData.notes} />
                            <Label htmlFor="tag">Tag</Label>
                            <Input id="tags" type="text" placeholder="e.g. Remote, Urgent, Internship" onChange={(e) => setFormData({...formData, tags: e.target.value})} value={formData.tags} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Add Application
                        </Button>
                    </div>
                    
                </form>
            </DialogContent>
        </Dialog>
    )
}
