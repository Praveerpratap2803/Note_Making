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
    id:string;
    username:string;
    password:string;
    first_name:string;
    last_name: string | null;
    created_by: string | null;
    created_on: Date;
    modified_by: string | null;
    modified_on: Date;
    deleted_by: string | null;
    deleted_on: Date | null;
}
export interface Priority{
    id:string;
    priority:number;
    note_id:string;
}
export interface Priority1{
    id:string;
    priority:number;
    note_id:string;
    user_id:string;
}