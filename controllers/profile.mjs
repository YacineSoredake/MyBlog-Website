import db from './db/connect.mjs'

const profile = (request,response) => {
    const bearerhead = request.headers["authorization"]
    const accessToken = bearerhead.split(' ')[1]
    const decodedAcessToke = jwt.decode(accessToken)
    const payload = decodedAcessToke.aud
    return response.status(200).json({msg:"you can see your profile", username : payload})
  }

const userInformation = (request,response) => {
    const { username } = request.body;
    const sql =  `SELECT * FROM profile JOIN user ON user.id = profile.matricule WHERE user.username= ?` 
    db.query(sql,[username],(err,data) => {
      if (err) {
        return response.status(400).json({success:false ,msg:"error while executing the query"})
      }
      if (data.length === 0) {
        return response.status(404).json({success:true ,msg:"query 1 executed with empty result"})
      }
      const sql2 = `SELECT title,image,blogs.id,author FROM blogs JOIN user ON user.id = blogs.author WHERE user.username= ?`
      db.query(sql2,[username],(err,blogs) => {
        if (err) {
          return response.status(400).json({success:false ,msg:"error while executing the query"})
        }
        if (data.length === 0) {
          return response.status(404).json({success:true ,msg:"query 2 executed with empty result"})
        }
        return response.status(200).json({success:true,msg:"query with result" , information:data, blogs:blogs})
      })
    })
  }

const updatePic = async(request,response) => {
    const{username}=request.body;
    const image = request.file ? request.file.filename : null; 
    const profileQuery = "UPDATE profile SET `image` = ? WHERE `matricule` = ?";
    const userQuery ="SELECT p.matricule from profile p  join user u on p.matricule = u.id where u.username = ?"
    const objMatricule = await new Promise((resolve, reject) =>{
     db.query(userQuery,[username],(err,res) => {
       if (err) {
         reject(err)
       }
       resolve(res)
      })
    })
    const matricule =  objMatricule[0].matricule;
    db.query(profileQuery,[image,matricule],(err,res) => {
     if (err) {
       return response.status(400).json({succes:false,msg:"query error"})
     }
     if(res.affectedRows === 0){
       return response.status(400).json({succes:false,msg:"no rows updatetd"})
     }
     return response.status(200).json({succes:true,msg:"profile picture updatetd successfully",res})
    })
   }

export default {profile,userInformation,updatePic};