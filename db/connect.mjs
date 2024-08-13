import mysql from "mysql";

const db =mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"test",
});
export default db;