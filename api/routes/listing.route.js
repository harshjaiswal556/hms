import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings, requestListing, getRequestListing, updateRentRequestStatus } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteListing)
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

router.post('/rent/:id/request', verifyToken, requestListing);
router.get('/rent/:id/request', verifyToken, getRequestListing);

router.patch('/requests/:id/status', verifyToken, updateRentRequestStatus);
export default router;