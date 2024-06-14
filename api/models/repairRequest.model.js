import mongoose from 'mongoose';

const repairRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    repairType: {
        type: String,
        enum: ['electrician', 'plumber', 'carpenter', 'other'],
        required: true
    },
    priceRange: {
        type: String,
        default: ''
    },
    worker: {
        name: {
            type: String,
            default: ''
        },
        mobile: {
            type: String,
            default: ''
        },
        image: {
            type: String,
            default: ''
        }
    }
}, {
    timestamps: true
});

const RepairRequest = mongoose.model('RepairRequest', repairRequestSchema);

export default RepairRequest;
