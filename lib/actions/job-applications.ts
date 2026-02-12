"use server";

import { getSession } from "../auth/auth";
import { revalidatePath } from "next/cache";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";

interface JobApplicationData {
    company: string;
    position: string;
    location?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    columnId: string;
    boardId: string;
    tags?: string[];
    description?: string;
}

export async function createJobApplication(data: JobApplicationData) {
    const session = await getSession();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    await connectDB();

    const { company, position, location, notes, salary, jobUrl, columnId, boardId, tags, description } = data;

    if (!company || !position || !columnId || !boardId) {
        return { error: "Missing required fields" };
    }

    const board = await Board.findOne({_id: boardId, userId: session.user.id});
    if (!board) {
        return { error: "Board not found" };
    }

    const column = await Column.findOne({_id: columnId, boardId: boardId});
    if (!column) {
        return { error: "Column not found" };
    }

    const lastOrder = await JobApplication.findOne({columnId: columnId}).sort({order: -1}).select("order").lean() as {order: number} | null;

    const jobApplication = await JobApplication.create({
        company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        columnId,
        boardId,
        tags:tags || [],
        description,
        userId: session.user.id,
        status: "applied",
        order: lastOrder ? lastOrder.order + 1 : 0,
    });

    await Column.findByIdAndUpdate(columnId, {
        $push: { jobApplications: jobApplication._id },
    });

    revalidatePath("/dashboard");

    return {data: JSON.parse(JSON.stringify(jobApplication))};

    
    
    
}