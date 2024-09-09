import db from './db/connect.mjs'
import express, { response } from 'express';
const router = express.Router();
import {authent,register} from './controllers/auth.mjs'
import {verifyAccessToken,verifyRefreshToken,signAccessToken,signRefreshToken,refresh,upload} from '../middlewares.mjs'

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.post('/',verifyAccessToken,authent);
router.post('/',register);

export default router;