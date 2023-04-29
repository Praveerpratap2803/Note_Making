type Favorite="Yes"|"No";
export interface Note{
    id:string;
    note_message:string;
    user_id:string;
    favorite:Favorite;
}
export interface User{
    username:string;
    password:string;
    first_name:string;
}
