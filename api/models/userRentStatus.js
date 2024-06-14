import mongoose from 'mongoose';

const userRentStatusSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requests: [{
        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true
        }
    }]
}, {
    timestamps: true
});

userRentStatusSchema.virtual('requestsDetails', {
    ref: 'RentalRequest',
    localField: 'requests.listing',
    foreignField: 'listing',
    justOne: false,
    options: { match: { user: { $exists: true } } } // Fetch requests where user exists
});

userRentStatusSchema.set('toObject', { virtuals: true });
userRentStatusSchema.set('toJSON', { virtuals: true });

const UserRentStatus = mongoose.model('UserRentStatus', userRentStatusSchema);

export default UserRentStatus;
