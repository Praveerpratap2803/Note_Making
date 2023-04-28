// import { Note } from "@prisma/client";
import { Note } from "./Interface";
import express from "express";
import { Request, Response } from "express";
import { db } from "./dataBase";
import cors from "cors";
const app = express();
const port = 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/createNote", async (req: Request, res: Response) => {
  try {
    let NoteData: Note = req.body;
    console.log(NoteData);
    let { note_message, user_id } = NoteData;
    let usersData = await db.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!usersData) {
      return res.status(200).json({ message: "Data not found", data: user_id });
    }
    let createdNote = await db.note.create({
      data: {
        note_message,
        user_id,
      },
    });
    return res
      .status(200)
      .json({ message: "Note created successfully", data: createdNote });
  } catch (error) {
    res.json({ message: "Server Error" });
  }
});

app.get(
  "/getAllNotesByUserId/:user_id",
  async (req: Request, res: Response) => {
    try{
    let user_id: string = req.params.user_id;
    let usersData = await db.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!usersData) {
      return res.status(200).json({ message: "Data not found", data: user_id });
    }
    let allNotes: Note[] = await db.note.findMany({
      orderBy: {
        modified_on: "desc",
      },
      where: {
        user_id,
      },
    });
    return res
      .status(200)
      .json({ message: "Fetched List of Note successfully", data: allNotes });
    } catch (error) {
      res.json({ message: "Server Error" });
    }
  }
);

app.put("/updateNote", async (req: Request, res: Response) => {
  try{
  let NoteData: Note = req.body;
  let { id, note_message, user_id } = NoteData;

  let noteData = await db.note.findUnique({
    where: {
      id,
    },
  });
  if (!noteData) {
    return res.status(200).json({ message: "Data not found", id: id });
  }
  let usersData = await db.user.findUnique({
    where: {
      id: user_id,
    },
  });
  if (!usersData) {
    return res
      .status(200)
      .json({ message: "Data not found", user_id: user_id });
  }
  let updatedNote: Note = await db.note.update({
    where: {
      id,
    },
    data: {
      note_message,
      user_id,
    },
  });
  return res
    .status(200)
    .json({ message: "Note updated successfully", data: updatedNote });
  } catch (error) {
    res.json({ message: "Server Error" });
  }
});

app.get("/getNoteById/:id", async (req: Request, res: Response) => {
  try{
  let id: string = req.params.id;
  let data = await db.note.findUnique({
    where: {
      id,
    },
  });
  if (!data) {
    return res.status(200).json({ message: "Data not found", id });
  }
  return res.status(200).json({ message: "Fetched note successfully", data });
} catch (error) {
  res.json({ message: "Server Error" });
}
});

app.delete("/deleteNote/:id", async (req: Request, res: Response) => {
  try{
  let id: string = req.params.id;
  let data = await db.note.findUnique({
    where: {
      id,
    },
  });

  if (!data) {
    return res.status(200).json({ message: "Data not found" });
  }
  await db.note.delete({
    where: {
      id,
    },
  });
  return res.status(200).json({ message: "Note deleted successfully" });
} catch (error) {
  res.json({ message: "Server Error" });
}
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
