import express, { response } from 'express';
import db from './db/connect.mjs'
import multer  from 'multer';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import  jwt  from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bcrypt from "bcrypt";


dotenv.config();

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: 'http://127.0.0.1:5500', // The origin you want to allow
  credentials: true, // Enable cookies to be sent and received
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploaded") 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });  

// verify jwt middleware
 
const verifyAccessToken = (request, response, next) => {
  const authHeader = request.headers['authorization'];
  if (!authHeader) {
    return response.status(401).json({ message: 'Authorization header missing' });
  }
  const accestoken = authHeader.split(' ')[1];
  jwt.verify(accestoken,process.env.ACCES_TOKEN_SECRET, (err, payload) => {
    if (err) {
      let message = '';
      if (err.name === 'TokenExpiredError') {
        message = 'Token expired';
      } else if (err.name === 'JsonWebTokenError') {
        message = 'Unauthorized';
      } else {
        message = err.message;
      }
      return response.status(401).json({ message });
    }
    request.payload = payload;
    next();
  });
};

app.post("/refresh", async (request, response) => {
  try {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return response.status(401).json({ message: 'Authorization header missing' });
    }
    const refreshToken = authHeader.split(' ')[1];
    if (!refreshToken) {
      return response.status(404).json({ msg: "No token in cookies" });
    }

    const user = await verifyRefreshToken(refreshToken);
    const newAccessToken = await signAccessToken(user);
    const newRefreshToken = await signRefreshToken(user);
    return response.status(200).json({ success: true, refreshToken: newRefreshToken, accessToken: newAccessToken });
  } catch (error) {
    return response.status(500).json({ message: 'Internal server error' });
  }
});

/// verify refresh token

const verifyRefreshToken = async (refToken) => {
  if(!refToken){
    console.log("ref token empty")
  }
  return new Promise((resolve, reject) => {
    jwt.verify(refToken,process.env.REFRESH_TOKEN_SECRET,(err,payload) => {
      if (err) {
        return reject(err)
      }
      const user = payload.aud;
      resolve(user)
     })
  })
}

// sign token for user middleware

const signAccessToken = async (user) => {
  const payload = {};
  const secret = process.env.ACCES_TOKEN_SECRET;
  const options =  {
    expiresIn:'5m',
    issuer:'formulaBlg',
    audience:user
  }
  const acccesToken = jwt.sign(payload,secret,options);
  return acccesToken
}

// sign token for user middleware

const signRefreshToken = async (user) => {
const payload = {};
const secret = process.env.REFRESH_TOKEN_SECRET;
const options = {
  expiresIn:'2d',
  issuer:'formulaBlg',
  audience:user
}
const refreshtoken = jwt.sign(payload,secret,options);
return refreshtoken
}

app.post("/blog/auth", async (request, response) => {
  const { username, password } = request.body;

  const sql = `SELECT * FROM user WHERE username = ?`;
  const values = [username];

  try {
    const data = await new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (data.length === 0) {
      return response.status(404).json({ success: false, msg: "Username don't exist" });
    }
    const hashedPass = data[0].password;
    const match = await new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPass)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });

    if (match) {
      const user = data[0].username;
      const accessToken = await signAccessToken(user);
      const refreshToken = await signRefreshToken(user);
      return response.status(200).json({
        success: true,
        msg: "User found",
        user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      return response.status(404).json({ success: false, msg: "Password doesn't match" });
    }
  } catch (err) {
    return response.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
});

app.get("/profile",verifyAccessToken,(request,response) => {
  const bearerhead = request.headers["authorization"]
  const accessToken = bearerhead.split(' ')[1]
  const decodedAcessToke = jwt.decode(accessToken)
  const payload = decodedAcessToke.aud
  return response.status(200).json({msg:"you can see your profile", username : payload})
})

// display all blogs for viewers
app.get("/blog",(request, response) => {
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
})

app.get("/blog/:id",(request,response) => {
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
})

// filter blog by fields
app.post("/blog", (request, response) => {
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
  });


  app.post("/blog/add", upload.single("image"), (request, response) => {
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
  });

  app.delete("/blog/delete/:id", (request, response) => {
    const id = request.params.id;
    const sql = "DELETE FROM `blogs` WHERE id= ?";
    const value = [id];
    
    db.query(sql, value, (err, data) => {
      if (err) {
        return response.status(400).json({ msg: "error in deleting", success: false });
      }
      return response.status(200).json({ msg: "blog deleted successfully", success: true });
    });
  });

  app.put("/blog/update/:id",upload.single("image"), (request, response) => {
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
  });

app.post("/user/information",(request,response) => {
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
})
// enregister compte b francais frr 

app.post("/myblog/register", async (request, response) => {
  const {username, password, fullname, occupation} = request.body;
  console.log(`Received data: username=${username}, fullname=${fullname}, occupation=${occupation}`);

  try {
      const saltRounds = Number(process.env.SALTROUNDS);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const userQuery = "INSERT INTO user (username, password) VALUES (?, ?)";
      const profileQuery = "INSERT INTO profile (matricule, FullName, PreOccupation) VALUES (?, ?, ?)";

      const userResult = await new Promise((resolve, reject) => {
          db.query(userQuery, [username, hashedPassword], (err, res) => {
              if (err) {
                  return reject(err);
              }
              resolve(res);
          });
      });

      const userId = userResult.insertId;

      await new Promise((resolve, reject) => {
          db.query(profileQuery, [userId, fullname, occupation], (err, res) => {
              if (err) {
                  return reject(err);
              }
              resolve(res);
          });
      });

      console.log("User and profile created successfully");
      return response.status(200).json({ success: true, msg: "User and profile created successfully" });
  } catch (error) {
      console.error("Error processing request:", error);
      return response.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/updatePic",upload.single("image"),async(request,response) => {
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
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});