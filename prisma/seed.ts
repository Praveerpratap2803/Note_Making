import { db } from "../src/dataBase";

async function seed() {
  let superAdminUserFound = await db.user.findFirst({
    where: {
      first_name: "Super Admin",
    },
  });
  if(!superAdminUserFound){
    let admincreated = await db.user.create({
        data:{
            first_name:"Super Admin",
            username:"username2",
            password:"password2"
        }
    })
  }
}
seed();
