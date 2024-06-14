import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createRepairRequest, getRepairRequestByUserId, getRepairRequestByOwnerId, updateRepairRequestByRequestId } from '../controllers/repair.controller.js';

const router = express.Router();

router.post('/repair-request', verifyToken, createRepairRequest);
router.get('/user/:id/repair-request', verifyToken, getRepairRequestByUserId);
router.get('/owner/:ownerId/repair-request', verifyToken, getRepairRequestByOwnerId);
router.patch('/owner/repair-request/:requestId', verifyToken, updateRepairRequestByRequestId);
export default router;