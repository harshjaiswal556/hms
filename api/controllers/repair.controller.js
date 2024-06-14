import { errorHandler } from '../utils/error.js';
import RepairRequest from '../models/repairRequest.model.js';
import Listing from '../models/listing.model.js';

export const createRepairRequest = async (req, res, next) => {
    try {
        if (req.user.id !== req.body.user) return next(errorHandler(401, "You can only raise repair request by your own account to the rented property!"))
        const newRepairRequest = await RepairRequest.create(req.body);
        const savedRepairRequest = await newRepairRequest.save();
        res.status(201).json({ success: true, repairRequest: savedRepairRequest });
    } catch (error) {
        next(error);
    }
}

export const getRepairRequestByUserId = async (req, res, next) => {
    try {
        if (req.params.id !== req.user.id) return next(errorHandler(401, "You can only view your own repair request!"))
        const repairRequest = await RepairRequest.find({ user: req.params.id }).populate('listing');
        res.status(200).json(repairRequest);
    } catch (error) {
        next(error);
    }
}

export const getRepairRequestByOwnerId = async (req, res, next) => {
    try {
        const { ownerId } = req.params;

        if (ownerId !== req.user.id) return next(errorHandler(401, "You can only view repair request which has been raised on your listed properties!"))

        // Find listings owned by the owner
        const listings = await Listing.find({ useRef: ownerId });

        // Get the listing IDs owned by the owner
        const listingIds = listings.map(listing => listing._id);

        // Find repair requests for these listings
        const repairRequests = await RepairRequest.find({
            listing: { $in: listingIds }
        }).populate('user listing');

        res.status(200).json({ success: true, repairRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateRepairRequestByRequestId = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const { priceRange, workerName, workerMobile, workerImage } = req.body;

        // Find and update the repair request
        const updatedRepairRequest = await RepairRequest.findByIdAndUpdate(
            requestId,
            {
                status: 'in-progress',
                priceRange,
                'worker.name': workerName,
                'worker.mobile': workerMobile,
                'worker.image': workerImage
            },
            { new: true }
        );

        if (!updatedRepairRequest) {
            return res.status(404).json({ success: false, message: 'Repair request not found' });
        }

        res.status(200).json({ success: true, repairRequest: updatedRepairRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}