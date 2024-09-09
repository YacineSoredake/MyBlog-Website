import db from './db/connect.mjs'

const getBlog = (request, response) => {
    const sql = `SELECT b.title,b.description,b.image,b.field,b.date,p.fullName,p.image AS pdp,p.preOccupation 
    FROM blogs b JOIN profile p ON b.author = p.matricule`
    db.query(sql,(err,data)=>{
      if (err) {
        return response.status(404).json({success:false,msg:"query error"});
      }
      if (data.length === 0 ) {
        return response.status(404).json({success:true,msg:"empty result from query"});
      }
      return response.status(200).json({success:true,msg:"result found",data:data});
    })
}

const idblog = (request,response) => {
    const {id} = request.params
    const sql = `SELECT b.id,b.title,b.description,b.image,b.field,b.date,p.fullName,p.image AS pdp,p.preOccupation, u.username 
    FROM blogs b JOIN profile p ON b.author = p.matricule JOIN user u ON p.matricule = u.id where b.id = ?`
    db.query(sql,[id],(err,data) => {
      if (err) {
        return response.status(404).json({succes:false,msg:"query error"})
      }
      if (data.length ===0) {
        return response.status(201).json({succes:true,msg:"empty result"})
      }
      return response.status(200).json({succes:true,msg:"result found" , data:data})
    })
}

const postBlog = (request, response) => {
    const { field } = request.body;
    const sql = "SELECT * FROM blogs WHERE field = ?";
    
    db.query(sql, [field], (err, data) => {
      if (err) {
        return response.status(400).json({ success: false, message: "error in query" });
      }
      if (data.length === 0) {
        const sql2 = "SELECT * FROM blogs";
        db.query(sql2, [], (err, allData) => {
          if (err) {
            return response.status(400).json({ success: false, message: "error in query" });
          }
          return response.status(200).json({ success: true, message: "no such field, returning all blogs", data: allData });
        });
      } else {
        return response.status(200).json({ success: true, message: "blog information", data: data });
      }
    });
  }
  
const addBlog = (request, response) => {
    const { author, description, field, title, date } = request.body;
    const image = request.file ? request.file.filename : null; 
  
    const sql = "INSERT INTO blogs (author, description, field, title, date, image) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [author, description, field, title, date, image];
  
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error("Error inserting data:", err);
        return response.status(400).json({ msg: "Error in inserting", success: false });
      }
      return response.status(200).json({ msg: "Blog inserted successfully", success: true });
    });
  }
  
const deleteBlog = (request, response) => {
    const id = request.params.id;
    const sql = "DELETE FROM `blogs` WHERE id= ?";
    const value = [id];
    
    db.query(sql, value, (err, data) => {
      if (err) {
        return response.status(400).json({ msg: "error in deleting", success: false });
      }
      return response.status(200).json({ msg: "blog deleted successfully", success: true });
    });
  }
  
const updateBlog = (request, response) => {
    const { title, description,field,image  } = request.body;
    const id = request.params.id
    const sql = "UPDATE `blogs` SET title = ?, `description` = ? , `field` =  ?,`image` = ? WHERE `id`=?";
    const values = [title, description, field,image ,id];
    
    db.query(sql, values, (err, data) => {
      if (err) {
        return response.status(400).json({ msg: "error in inserting", success: false });
      }
      return response.status(200).json({ msg: "blog updated successfully", success: true , data:data});
    });
}

export default {getBlog,idblog,postBlog,addBlog,deleteBlog,updateBlog}