import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import RentalRequest from "../models/rentalRequest.model.js";
import User from "../models/user.model.js";
import UserRentStatus from "../models/userRentStatus.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(200).json(listing)

    } catch (error) {
        next(error);
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.useRef) {
        return next(errorHandler(401, 'You are not authorized to delete this listing!'));
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Listing deleted successfully!' })
    } catch (error) {

    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.useRef) {
        return next(errorHandler(401, 'You can only update your own listing!'));
    }
    try {
        const updateListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        return res.status(200).json(updateListing);
    } catch (error) {
        next(error);
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }
        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};

export const requestListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, message } = req.body;

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const rentalRequest = new RentalRequest({
            listing: listing._id,
            user: user._id,
            message
        });

        await rentalRequest.save();

        listing.rentalRequests.push(rentalRequest._id);
        await listing.save();

        // res.status(201).json(rentalRequest);


        let userRentStatus = await UserRentStatus.findOne({ user: userId });
        if (!userRentStatus) {
            userRentStatus = new UserRentStatus({ user: userId, requests: [] });
        }

        userRentStatus.requests.push({
            listing: listing._id,
            status: rentalRequest.status
        });

        await userRentStatus.save();

        // res.status(201).json(userRentStatus);
        res.status(201).json({ rentalRequest, userRentStatus });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateRentRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const rentalRequest = await RentalRequest.findById(id);
        if (!rentalRequest) {
            return res.status(404).json({ message: 'Rental request not found' });
        }

        rentalRequest.status = status;
        await rentalRequest.save();

        res.status(200).json(rentalRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getRequestListing = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id).populate({
            path: 'rentalRequests',
            populate: {
                path: 'user',
                select: 'username email'
            }
        });

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.status(200).json(listing.rentalRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}