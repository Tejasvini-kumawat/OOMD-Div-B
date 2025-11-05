import express from 'express';
import { createDonation, updateStatus, getUserDonations, getNGODonations } from '../controllers/donationController.js';
import  authMiddleware  from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const donationRouter = express.Router();

// donationRouter.post('/', authMiddleware, upload.single('pdf'), createDonation); // Donation will be done by user
donationRouter.post('/', authMiddleware, upload.array('images',10), createDonation); // Donation will be done by user
donationRouter.put('/:id/status', authMiddleware, updateStatus);
donationRouter.get('/user/:userId', authMiddleware, getUserDonations);
donationRouter.get('/ngo/:ngoId', authMiddleware, getNGODonations);

export default donationRouter;
