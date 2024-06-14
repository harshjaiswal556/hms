import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function RepairRequests() {
    const { currentUser } = useSelector((state) => state.user);
    const [repairRequests, setRepairRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRepairRequests = async () => {
            try {
                const response = await fetch(`/api/repair/user/${currentUser._id}/repair-request`);
                if (!response.ok) {
                    throw new Error('Failed to fetch repair requests');
                }
                const data = await response.json();
                setRepairRequests(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchRepairRequests();
    }, [currentUser._id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-semibold text-center my-7">Repair Requests</h1>
            {repairRequests.length === 0 ? (
                <p className="text-xl font-semibold text-red-700">No repair requests found.</p>
            ) : (
                <ul>
                    {repairRequests.map((request) => (
                        <li key={request._id}>
                            <h2>{request.listing.name}</h2>
                            <p>Description: {request.description}</p>
                            <p>Status: {request.status}</p>
                            {request.worker.name && (
                                <div>
                                    <p>Worker Name: {request.worker.name}</p>
                                    <p>Worker Mobile: {request.worker.mobile}</p>
                                    <img src={request.worker.image} alt={request.worker.name} width="100" />
                                </div>
                            )}
                            <p>Price Range: {request.priceRange}</p>
                            <div>
                                <h3>Listing Details:</h3>
                                <p>Address: {request.listing.address}</p>
                                <div>
                                    <img src={request.listing.imageUrls[0]} alt="Error. Please try again later!" width="100" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
