import { db } from "../src/dataBase";

async function seed() {
    console.log("running seed file");
  let superAdminUserFound = await db.user.findFirst({
    where: {
      first_name: "Super Admin",
    },
  });
  console.log(superAdminUserFound);
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
