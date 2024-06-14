import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    securityDeposit: {
        type: Number,
        default: 0,
    },
    utilityBills: {
        type: Number,
        default: 0,
    },
    lateFees: {
        type: Number,
        default: 0,
    },
    serviceFees: {
        type: Number,
        default: 0,
    },
    rentFees: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    furnished: {
        type: Boolean,
        required: true
    },
    parking: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    offer: {
        type: Boolean,
        required: true
    },
    imageUrls: {
        type: Array,
        required: true
    },
    useRef: {
        type: String,
        required: true
    },
    rentalRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RentalRequest'
    }]

}, {
    timestamps: true
})

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;