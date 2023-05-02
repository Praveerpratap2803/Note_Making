import { Note,Priority,Priority1,User } from "./Interface";
import express from "express";
import { Request, Response } from "express";
import { db } from "./dataBase";
import cors from "cors";
import checkAdmin from "./checkAdmin";
import jwt from 'jsonwebtoken';
import checkingTokenPresent from "./checkingTokenPresent";
import userChecking from "./jwtToken";
const app = express();
const port = 3000;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.post("/login",async (req,res)=>{
  try {
    let user:User = req.body;
    let {username,password} = user
    let userData = await db.user.findFirst({
      where:{
        username,
      }
    })

    if(!userData || userData.password!==password){
      return res.status(400).json({message:"Incorrect username or password"})
    }
    const secretKey = 'praveer';
    const token = jwt.sign(userData,secretKey);
    return res.status(200).json({message:"login in successfully",data:{token,...userData}})
  } catch (error) {
    console.log(error);
  }
})
app.post("/createNote",checkingTokenPresent, async (req: Request, res: Response) => {
  try {
    let NoteData: Note = req.body;
    console.log(NoteData);
    let user = userChecking(req,res);
    console.log("user id from the jwt token",user.id);
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
    try {
      // let data = userChecking(req,res);
      // console.log(data.first_name);
      let user_id: string = req.params.user_id;
      let usersData = await db.user.findUnique({
        where: {
          id: user_id,
        },
      });
      if (!usersData) {
        return res
          .status(200)
          .json({ message: "Data not found", data: user_id });
      }
      // if(data.first_name==='Super Admin'){
      //   let allNotesAdmin = await db.note.findMany({});
      //   return res
      //   .status(200)
      //   .json({ message: "Super Admin Fetched List of Note successfully", data: allNotesAdmin });
      // }
      const isAdmin = await checkAdmin(user_id);
      if(isAdmin.length){
        let allNotesAdmin = await db.note.findMany({});
        return res
        .status(200)
        .json({ message: "Super Admin Fetched List of Note successfully", data: allNotesAdmin });
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
  try {
    let NoteData: Note = req.body;
    let { id, note_message, user_id,count_priority,end_date,start_date,created_on } = NoteData;

    let noteData:Note|null = await db.note.findUnique({
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
    let isAdmin = await checkAdmin(user_id)
    if(isAdmin.length && (start_date|| end_date||created_on)){
      console.log("updating admin");
      let created_on1 = new Date(created_on)
      let adminUpdateNote = await db.note.update({
        where:{
          id,
        },
        data:{
          note_message, 
          start_date,
          end_date,
          created_on:created_on1, 
          count_edit:noteData.count_edit+1
        },
      })
      return res
      .status(200)
      .json({ message: "Note updated successfully", data: adminUpdateNote });
    }else{

    let updatedNote: Note = await db.note.update({
      where: {
        id,
      },
      data: {
        note_message,
        count_edit:noteData.count_edit+1
      },
    });
    return res
      .status(200)
      .json({ message: "Note updated successfully", data: updatedNote });
  }
  } catch (error) {
    res.json({ message: "Server Error" });
  }
});

app.get("/getNoteById/:id", async (req: Request, res: Response) => {
  try {
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
  try {
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

app.put("/updateFavouriteTagById", async (req: Request, res: Response) => {
  const favouriteTagData: Note = req.body;
  let { favorite, id } = favouriteTagData;
  let favouriteTag:Note = await db.note.update({
    where: {
      id,
    },
    data: {
      favorite,
    },
  });

  return res
    .status(200)
    .json({ message: "FavouriteTag updated successfully", data: favouriteTag });
});

app.get(
  "/getAllFavoriteNotesByUserId/:user_id",
  async (req: Request, res: Response) => {
    let user_id:string = req.params.user_id;

    let usersData = await db.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!usersData) {
      return res.status(200).json({ message: "Data not found", user_id });
    }
    const isAdmin = await checkAdmin(user_id);
      if(isAdmin.length){
        let favoriteNotesAdmin = await db.note.findMany({
          where: {
            favorite:"Yes",
          },
        });
        return res
          .status(200)
          .json({ message: "Super Admin Fetched Favorite Notes Successfully", data:favoriteNotesAdmin });
      }
    let favoriteNotes = await db.note.findMany({
      where: {
        favorite:"Yes",
        user_id
      },
    });
    return res
      .status(200)
      .json({ message: "Fetched Favorite Notes Successfully", data:favoriteNotes });
  }
);
app.post('/createPriority',async(req:Request,res:Response)=>{
  const priorityData:Priority1 = req.body;
  // const {priority,note_id} = priorityData;
  const {priority,note_id,user_id} = priorityData;
  let isAdmin = await checkAdmin(user_id);
  if(!isAdmin.length){
    return res.status(200).json({message:"Not allowed",user_id:user_id})
  }
  let data = await db.note.findUnique({
    where: {
      id:note_id,
    },
  });
  if (!data) {
    return res.status(200).json({ message: "Data not found", note_id });
  }
  let priorityCreated = await db.priority.create({
      data:{
        note_id,
        priority
      }
  })
  let updateCount = await db.note.update({
    where:{
      id:note_id,
    },
    data:{
      count_priority:data.count_priority+1
    }
  })
  return res.status(201).json({message:"Priority created successfully",data:priorityCreated})
})
app.get('/getPriorityByNoteId/:note_id',async(req:Request,res:Response)=>{
  let note_id = req.params.note_id
  let data = await db.note.findUnique({
    where: {
      id:note_id,
    },
  });
  if (!data) {
    return res.status(200).json({ message: "Data not found", note_id });
  }
  let priorityData = await db.priority.findFirst({
    orderBy:{
      modified_on:'desc'
    },
    where:{
      note_id
    }
  })
  if(!priorityData){
    return res.status(200).json({message:"Data not found"});
  }
  return res.status(200).json({message:"Fetched priority",data:priorityData})
})
app.get('/getLastFivePrioritiesByNoteId/:note_id',async(req:Request,res:Response)=>{
  let note_id = req.params.note_id
  let data = await db.note.findUnique({
    where: {
      id:note_id,
    },
  });
  if (!data) {
    return res.status(200).json({ message: "Data not found", note_id });
  }
  let priorityData = await db.priority.findMany({
    orderBy:{
      modified_on:'desc'
    },
    where:{
      note_id
    },
    take:5,
  })
  if(!priorityData){
    return res.status(200).json({message:"Data not found"});
  }
  return res.status(200).json({message:"Fetched priority",data:priorityData})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
