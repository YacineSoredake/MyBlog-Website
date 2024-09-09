import db from './db/connect.mjs'
import express from 'express';
const router = express.Router();
import {getBlog,idblog,postBlog,addBlog,deleteBlog,updateBlog} from './controllers/blogs.mjs'
import {verifyAccessToken,verifyRefreshToken,signAccessToken,signRefreshToken,refresh,upload} from '../middlewares.mjs'

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get('/',getBlog);
router.get('/:id',idblog);
router.post('/:id',verifyAccessToken,postBlog);
router.post('/',upload.single['image'],addBlog);
router.delete('/:id',deleteBlog);
router.put('/:id',upload.single['image'],updateBlog);

export default router;