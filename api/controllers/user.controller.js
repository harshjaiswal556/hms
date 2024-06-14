import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import RentalRequest from '../models/rentalRequest.model.js';
import UserRentStatus from '../models/userRentStatus.js';

export const test = (req, res) => {
    res.send("Hello");
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account!"))
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true });

        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account!"))
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error)
    }
}

export const getUserListings = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only view your own listings!"));
    try {
        const listings = await Listing.find({ useRef: req.params.id });
        res.status(200).json(listings);
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const users = await User.findById(req.params.id);
        if (!users) {
            return next(errorHandler(404, "User not found!"));
        }
        const { password: pass, ...rest } = users._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

export const getUserRentStatus = async (req, res) => {
    try {
        const userRentStatus = await UserRentStatus.findOne({ user: req.params.id }).populate('requests.listing').populate({
            path: 'requestsDetails',
            match: { user: req.params.id },
            select: 'listing status -_id'
        });
        // console.log(userRentStatus.requestsDetails);
        if (!userRentStatus) {
            return res.status(404).json({ message: 'No rental status found for this user' });
        }

        res.status(200).json(userRentStatus.requestsDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}