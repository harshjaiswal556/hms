import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function OwnerRepairRequests() {

    const [repairRequests, setRepairRequests] = useState([]);
    const { currentUser, loading, error } = useSelector((state) => state.user);

    const getOwnerRepairRequests = async (ownerId) => {
        try {
            const res = await fetch(`/api/repair/owner/${ownerId}/repair-request`);
            const data = await res.json();
            if (data.success) {
                setRepairRequests(data.repairRequests);
            } else {
                console.error('Error fetching repair requests:', data.message);
            }
        } catch (error) {
            console.error('Error fetching repair requests:', error);
        }
    };

    useEffect(() => {
        if (currentUser._id) {
            getOwnerRepairRequests(currentUser._id);
        }
    }, [currentUser._id]);
    console.log(repairRequests);
    return (
        <div>
            <h1>Repair Requests for Your Listings</h1>
            <ul>
                {repairRequests.map((request) => (
                    <li key={request._id}>
                        {request.user.username} requested repair on listing {request.listing.name}: {request.description} (Status: {request.status})
                        {request.repairType}
                    </li>
                ))}
            </ul>
        </div>
    );
}
