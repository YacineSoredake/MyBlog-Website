import db from './db/connect.mjs'
import express, { response } from 'express';
const router = express.Router();
import {profile,userInformation,updatePic} from './controllers/profile.mjs'
import {verifyAccessToken,verifyRefreshToken,signAccessToken,signRefreshToken,refresh,upload} from '../middlewares.mjs'

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.post('/',verifyAccessToken,profile);
router.post('/',userInformation);
router.post('/',upload.single['image'],updatePic);

export default router;