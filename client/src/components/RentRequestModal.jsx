import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function RentRequestModal({ isVisible, onClose, children }) {
    if (!isVisible) return null;

    const { currentUser } = useSelector((state) => state.user);
    const [message, setMessage] = useState('');
    const params = useParams();

    const handleSubmit = async () => {
        try {
            const res = await fetch(`/api/listing/rent/${params.listingId}/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: currentUser._id, message })
            });
            const data = await res.json();
            if (data.success) {
                // setRepairRequests(data.repairRequests);
                console.log(data);
            } else {
                console.error('Error fetching repair requests:', data.message);
            }
        } catch (error) {
            console.error('Error fetching repair requests:', error);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-md w-full max-w-md">
                <h1 className='text-slate-700 font-bold mb-2'>Message to landlord</h1>
                <textarea type="text" placeholder='Enter message to landlord' className="border p-3 rounded-lg w-[100%]" id="message" required value={message}
                    onChange={(e) => setMessage(e.target.value)} />
                <div className="flex justify-between gap-4 mt-4">
                    <button className="bg-green-900 text-white rounded-lg px-3 py-1 uppercase hover:opacity-95 w-[50%] cursor-pointer" onClick={handleSubmit}>Submit</button>
                    <button className="bg-red-900 text-white rounded-lg px-3 py-1 uppercase hover:opacity-95 w-[50%] cursor-pointer" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}
