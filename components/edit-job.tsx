"use client";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { updateJobApplication } from "@/lib/actions/job-applications";
import { JobApplication } from "@/lib/models/models.types";

interface EditJobApplicationProps {
    job: JobApplication;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditJobApplication({ job, open, onOpenChange }: EditJobApplicationProps) {
    const [formData, setFormData] = useState({
        company: job.company,
        position: job.position,
        location: job.location ?? "",
        notes: job.notes ?? "",
        salary: job.salary ?? "",
        jobUrl: job.jobUrl ?? "",
        tags: job.tags?.join(", ") ?? "",
        description: job.description ?? "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const result = await updateJobApplication(job._id, {
                ...formData,
                tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0),
            });

            if (!result.error) {
                onOpenChange(false);
            } else {
                console.error("Failed to update job application", result.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Job Application</DialogTitle>
                    <DialogDescription>Update this job application</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="edit-company">Company *</Label>
                                <Input id="edit-company" required onChange={(e) => setFormData({...formData, company: e.target.value})} value={formData.company} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="edit-position">Position *</Label>
                                <Input id="edit-position" required onChange={(e) => setFormData({...formData, position: e.target.value})} value={formData.position} />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="edit-location">Location</Label>
                                <Input id="edit-location" onChange={(e) => setFormData({...formData, location: e.target.value})} value={formData.location} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="edit-salary">Salary</Label>
                                <Input id="edit-salary" type="number" min="0" placeholder="e.g - $100k - $120k" onChange={(e) => setFormData({...formData, salary: e.target.value})} value={formData.salary} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-jobUrl">Job URL</Label>
                            <Input id="edit-jobUrl" type="url" placeholder="https://company.com/careers/job-id" onChange={(e) => setFormData({...formData, jobUrl: e.target.value})} value={formData.jobUrl} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Input id="edit-description" type="text" placeholder="Short job description (optional)" onChange={(e) => setFormData({...formData, description: e.target.value})} value={formData.description} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-notes">Notes</Label>
                            <Input id="edit-notes" type="text" placeholder="Any additional notes (optional)" onChange={(e) => setFormData({...formData, notes: e.target.value})} value={formData.notes} />
                            <Label htmlFor="edit-tags">Tags</Label>
                            <Input id="edit-tags" type="text" placeholder="e.g. Remote, Urgent, Internship" onChange={(e) => setFormData({...formData, tags: e.target.value})} value={formData.tags} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
