import { db } from "./dataBase";
const checkAdmin = async (id:string) => {
  return await db.user.findMany({
    where: {
      id,
      first_name:"Super Admin"
    },
  });
};
export default checkAdmin;
