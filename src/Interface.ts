type Favorite="Yes"|"No";
export interface Note{
    id:string;
    note_message:string;
    user_id:string;
    favorite:Favorite;
    start_date:string|null;
    end_date:string|null;
    count_edit:number;
    count_priority:number;
    created_on:Date;
}
export interface User{
    username:string;
    password:string;
    first_name:string;
}
export interface Priority{
    id:string;
    priority:number;
    note_id:string;
}