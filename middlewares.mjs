
import  jwt  from 'jsonwebtoken';
import multer  from 'multer';

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
  
const refresh = async (request, response) => {
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
  };
  
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

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/uploaded") 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
    }
  });
  const upload = multer({ storage: storage });  

export default {verifyAccessToken,verifyRefreshToken,signAccessToken,signRefreshToken,refresh,upload}