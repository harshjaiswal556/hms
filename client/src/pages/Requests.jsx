import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ListingItem from '../components/ListingItem';
import { Link } from 'react-router-dom';

export default function Requests() {

    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [showRequestError, setRequestError] = useState(false);
    const [offerListings, setOfferListings] = useState([]);

    const fetchOfferListings = async (listingData) => {
        try {
            const fetchPromises = listingData.map(async ({ listingId, status }) => {
                const res = await fetch(`/api/listing/get/${listingId}`);
                const listing = await res.json();
                return { ...listing, status }; // Combine listing data with status
            });

            const results = await Promise.all(fetchPromises);
            console.log('Fetched Data:', results); // Debug: log fetched data

            // Flatten the results array if it's nested
            const listings = results.flat();

            // Update the state with the fetched listings
            setOfferListings(listings);
        } catch (error) {
            console.log(error);
        }
    };
    // console.log(offerListings);
    useEffect(() => {
        if (currentUser._id) {
            getUserRentRequests(currentUser._id);
        }
    }, [currentUser._id]);
    // console.log(currentUser._id);

    const getUserRentRequests = async (userId) => {
        try {
            setRequestError(false);
            const res = await fetch(`/api/user/${userId}/rent-status`);
            const data = await res.json();
            if (data.success === false) {
                setRequestError(true);
                return;
            }
            // Extract listing IDs and statuses
            const listingData = data.map(request => ({
                listingId: request.listing,
                status: request.status,
            }));
            console.log('Listing Data:', listingData); // Debug: log listing IDs and statuses

            await fetchOfferListings(listingData);
        } catch (error) {
            setRequestError(true);
            console.error('Error fetching rental requests:', error);
        }
    }
    console.log(offerListings);
    return (
        <div>
            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
                {offerListings && offerListings.length > 0 ? (
                    <div>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Rental Requests</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more requests</Link>
                        </div>
                        <div className='flex flex-wrap gap-4 justify-between'>
                            {offerListings.map((listing) => (
                                <div key={listing?._id} className="w-[330px]">
                                    <ListingItem listing={listing} />
                                    <div className="flex flex-row justify-between">
                                        <p className="font-bold bg-gray-300 text-gray-700 mt-2 p-3 rounded-md w-[150px]">Status: {listing.status}</p>
                                        {listing.status === 'accepted' ?
                                            <Link to={`/create-repair-request/${listing._id}`}>
                                                <p className="font-bold bg-gray-300 text-gray-700 mt-2 p-3 rounded-md w-[140px]cursor-pointer hover:opacity-80">Repair Request</p>
                                            </Link>
                                            : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>No listings available</div>
                )}
            </div>
        </div>
    )
}
