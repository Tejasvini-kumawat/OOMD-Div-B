import express from 'express';
import upload from '../middleware/multer.js';
import { signup, login, getAllNGOs, configureNGO } from '../controllers/authController.js';
import authMiddlware from '../middleware/authMiddleware.js';

const authRouter = express.Router();


authRouter.post('/signup', upload.single('logo'), signup);
authRouter.post('/login', login);
authRouter.get('/getAllNGOs',authMiddlware,getAllNGOs)
authRouter.post('/configure', authMiddlware, configureNGO)

export default authRouter;

// This is user router.
// He will just able to login and logout
// Placing donation order will be handled by donation controllers