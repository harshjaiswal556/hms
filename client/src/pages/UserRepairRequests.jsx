import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MdLocationOn } from 'react-icons/md';
import WorkerModal from '../components/WorkerModal.jsx'

export default function RepairRequests() {
    const { currentUser } = useSelector((state) => state.user);
    const [repairRequests, setRepairRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

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

    const handleStatusClick = (request) => {
        setSelectedRequest(request);
    };

    const handleCloseModal = () => {
        setSelectedRequest(null);
    };

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
                <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
                    <ul className='flex flex-wrap gap-4 justify-between'>
                        {repairRequests.map((request) => (
                            <div>
                                <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>

                                    <li key={request._id}>
                                        <div>
                                            <img src={request.listing.imageUrls[0]} className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300' alt="Error. Please try again later!" />
                                        </div>
                                        <div className='p-3 flex flex-col gap-2 w-full'>
                                            <p className='truncate text-lg font-semibold text-slate-700'>
                                                {request.listing.name}
                                            </p>
                                            <div className='flex items-center gap-1'>
                                                <MdLocationOn className='h-4 w-4 text-green-700' />
                                                <p className='text-sm text-gray-600 truncate w-full'>
                                                    {request.listing.address}
                                                </p>
                                            </div>
                                            <p className='text-sm text-gray-600 line-clamp-2'>
                                                <strong> Description: </strong>{request.description}
                                            </p>
                                        </div>
                                        {/* <p></p> */}

                                    </li>
                                    <p className="font-bold text-center bg-gray-300 text-gray-700 mt-2 p-3 rounded-md w-[140px]cursor-pointer hover:opacity-80" onClick={() => handleStatusClick(request)}>Status: {request.status}</p>
                                </div>
                                {/* {request.worker.name && (
                                    <div className='bg-gray-300 rounded-md w-[140px]cursor-pointer'>
                                        <h4 className='text-xl text-center my-2 font-bold text-gray-700'>Worker Details</h4>
                                        <p>{request.worker.name}</p>
                                        <p>{request.worker.mobile}</p>
                                        <img src={request.worker.image} alt={request.worker.name} width="100" />
                                        <p>{request.priceRange}</p>
                                    </div>
                                )} */}
                            </div>
                        ))}
                    </ul>
                </div>
            )}
            {selectedRequest && (
                <WorkerModal isOpen={!!selectedRequest} onClose={handleCloseModal}>
                    {selectedRequest.worker.name && (
                        <div className='bg-gray-300 rounded-md p-4'>
                            <h4 className='text-xl text-center my-2 font-bold text-gray-700'>Worker Details</h4>
                            <p><strong>Name: </strong>{selectedRequest.worker.name}</p>
                            <p><strong>Mobile: </strong>{selectedRequest.worker.mobile}</p>
                            <img src={selectedRequest.worker.image} alt={selectedRequest.worker.name} width="100" />
                            <p><strong>Price Range: </strong>{selectedRequest.priceRange}</p>
                        </div>
                    )}
                </WorkerModal>
            )}
        </div>
    );
}
