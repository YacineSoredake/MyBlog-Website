import db from './db/connect.mjs'
import{verifyAccessToken,verifyRefreshToken,signAccessToken,signRefreshToken,refresh} from "/middlewares.mjs"

const authent = async (request, response) => {
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
  };

const register = async (request, response) => {
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
  }
  
export default {authent,register};