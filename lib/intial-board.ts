import connectDB from "./db";
import { Board, Column } from "./models";

const DEFAULT_COLUMNS = [
    {name: "Dream List"  , order: 0},
    {name: "Applied", order: 1},
    {name: "Interviewing", order: 2},
    {name: "Offer", order: 3},
    {name: "Rejected", order: 4},
];

export default async function initializeBoard(userId: string) {
    try{
        const db = await connectDB();

        const existingBoard = await Board.findOne({userId, name: "Job Applications"});
        if (existingBoard) return existingBoard;

        const board = await Board.create({
            name: "Job Applications",
            userId : userId,
            columns : []
        })

        //Create default columns

        const columns = await Promise.all(
            DEFAULT_COLUMNS.map((col) => Column.create({
                name: col.name,
                order: col.order,
                boardId: board._id,
                JobApplications: [],
            }))
        )

        board.columns = columns.map((col) => col._id);

        await board.save();

        return board;

    }catch(error){
        throw error;
    }
}