import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function CreateRepairRequest() {

    const params = useParams();
    const { currentUser } = useSelector(state => state.user);
    const [description, setDescription] = useState('');
    const [repairType, setRepairType] = useState('');
    const [repairRequest, setRepairRequest] = useState(false);

    const handleRepairTypeChange = (e) => {
        setRepairType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/repair/repair-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: currentUser._id, listing: params.listingId, description, repairType })
            });
            const data = await res.json();
            if (data.success) {
                console.log('Repair request submitted:', data.repairRequest);
            } else {
                console.error('Error submitting repair request:', data.message);
                setRepairRequest(false);
            }
            setRepairRequest(true);
        } catch (error) {
            console.error('Error submitting repair request:', error);
        }
    };

    return (
        <div className="p-3 max-w-4xl mx-auto">

            <h1 className="text-3xl font-semibold text-center my-7">Submit Repair Request</h1>
            <form className='gap-4 sm:flex-row mb-5' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 flex-1">
                    <textarea
                        className="border p-3 rounded-lg"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the repair needed"
                        required
                    />
                    <div className="flex gap-6 flex-wrap">
                        <label>Repair Type:</label>

                        <div className='flex gap-2'>
                            <input
                                className='w-4'
                                type="radio"
                                value="electrician"
                                checked={repairType === 'electrician'}
                                onChange={handleRepairTypeChange}
                            />
                            <span>Electrician</span>
                        </div>
                        <div className='flex gap-2'>
                            {/* <label> */}
                            <input
                                className='w-4'
                                type="radio"
                                value="plumber"
                                checked={repairType === 'plumber'}
                                onChange={handleRepairTypeChange}
                            />
                            <span>Plumber</span>

                            {/* </label> */}
                        </div>
                        <div className='flex gap-2'>
                            {/* <label> */}
                            <input
                                className='w-4'
                                type="radio"
                                value="carpenter"
                                checked={repairType === 'carpenter'}
                                onChange={handleRepairTypeChange}
                            />
                            <span>Carpenter</span>

                            {/* </label> */}
                        </div>
                        <div className='flex gap-2'>
                            {/* <label> */}
                            <input
                                className='w-4'
                                type="radio"
                                value="other"
                                checked={repairType === 'other'}
                                onChange={handleRepairTypeChange}
                            />
                            <span>Other</span>

                            {/* </label> */}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row p-2 justify-around">
                    <button className='mt-5 p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-[45%]' type="submit">Submit</button>
                    <button className='mt-5 p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-[45%]' type="reset">Clear</button>
                </div>
            </form>
            <p className="text-green-700 mt-5">{repairRequest ? 'Successfully raised your repair request' : ''}</p>
        </div>
    );
}
