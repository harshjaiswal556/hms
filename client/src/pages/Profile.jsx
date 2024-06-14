import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signOutUserStart, signOutUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
    const dispatch = useDispatch();
    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({})
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingError, setListingError] = useState(false);
    const [userListings, setUserListings] = useState([]);
    const [userRentRequest, setUserRentRequest] = useState([]);
    // console.log(userListings);
    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    useEffect(() => {
        handleShowRentRequests();
        handleShowListings();
    }, []);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFilePerc(Math.round(progress));
        },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, avatar: downloadURL });
                })
            }
        )
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);

        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    }

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`api/user/delete/${currentUser._id}`, {
                method: 'DELETE'
            }
            );

            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));


        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }

    }


    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(data.message));
        }
    };

    const handleShowListings = async () => {
        try {
            setListingError(false);
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                setListingError(true);
                return;
            }
            setUserListings(data);
        } catch (error) {
            setListingError(true);
        }
    }

    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
        } catch (error) {
            console.log(error.message);
        }

    }

    const handleShowRentRequests = async () => {
        try {
            setListingError(false);
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                setListingError(true);
                return;
            }

            const fetchRequests = data.map(listing =>
                fetch(`/api/listing/rent/${listing._id}/request`).then(result => result.json())
            );

            const array = await Promise.all(fetchRequests);
            setUserRentRequest(array);
        } catch (error) {
            setListingError(true);
        }
    }

    console.log(userRentRequest);
    // console.log(userListings);

    const updateStatus = async (listingId, status) => {
        try {
            const res = await fetch(`/api/listing/requests/${listingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: status })
            });
            const data = await res.json();
            console.log(data);
            if (data.success === false) {
                setListingError(true);
                return;
            }

        } catch (error) {
            setListingError(true);
        }
    }
    return (
        <div className='p-3 max-w-6xl mx-auto'>
            <h1 className="text-3xl font-semibold text-center my-7"> Profile </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-col gap-4 w-full sm:w-1/3">
                    {/* <button onClick={handleShowRentRequests} className='text-green-700 mx-auto'>Show Rent Requests</button> */}
                    <p className="mt-5 text-red-700">{showListingError ? 'Error in Showing Requests' : ''}</p>
                    {userRentRequest && userRentRequest.length > 0 && (
                        // {userRentRequest && userRentRequest.length > userListings.length && (
                        <div className="flex flex-col gap-4">
                            <h1 className='text-center mt-7 text-2xl font-semibold'>
                                Rent Requests
                            </h1>
                            {userRentRequest.map((request) => (
                                <div>
                                    {request && request.length > 0 && (
                                        <div className='border rounded-lg p-3 flex justify-between items-center gap-4' key={request._id}>
                                            {/* {request[0].listing} */}

                                            <Link className='text-slate-700 font-semibold  hover:underline truncate flex-1' to={`/listing/${request[0].listing}`}>
                                                <p>
                                                    {request[0].user.username}
                                                </p>
                                                <p>
                                                    {request[0].status}
                                                </p>
                                            </Link>
                                            {/* {request && request.length > 0 && ( */}
                                            <div className='flex flex-col item-center'>
                                                <button onClick={() => updateStatus(request[0]._id, 'accepted')} className='text-green-700 uppercase'>Accept</button>
                                                <button onClick={() => updateStatus(request[0]._id, 'rejected')}
                                                    className='text-red-700 uppercase'
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className='flex flex-col gap-4 w-full sm:w-1/3'>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
                        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
                        <p className="text-sm self-center">
                            {fileUploadError ?
                                <span className="text-red-700">Error Image Upload (Image must be less than 2MB)</span> : filePerc > 0 && filePerc < 100 ? (
                                    <span className="text-slate-700">Upload {filePerc}%</span>)
                                    :
                                    (filePerc === 100 ? (
                                        <span className="text-green-700">Image Successfully Uploaded</span>
                                    ) : ""
                                    )}
                        </p>
                        <input type="text" defaultValue={currentUser.username} id="username" placeholder='username' className='border p-3 rounded-lg' onChange={handleChange} />
                        <input type="email" defaultValue={currentUser.email} id="email" placeholder='email' className='border p-3 rounded-lg' onChange={handleChange} />
                        <input type="password" id="password" placeholder='password' className='border p-3 rounded-lg' />
                        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>{loading ? '...Loading' : 'Update'}</button>
                        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}> Create Listing
                        </Link>
                    </form>
                    <div className='flex justify-between mt-5'>
                        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
                        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
                    </div>
                    <p className="text-red-700 mt-5">{error ? error : ''}</p>
                    <p className="text-green-700 mt-5">{updateSuccess ? 'Successfully updated' : ''}</p>
                </div>
                <div className='flex flex-col gap-4 w-full sm:w-1/3' >
                    {/* <button onClick={handleShowListings} className='text-green-700 mx-auto'>Show Listings</button> */}
                    <p className="mt-5 text-red-700">{showListingError ? 'No Listings found or error in showing listing' : ''}</p>
                    {userListings && userListings.length > 0 && (
                        <div className='flex flex-col gap-4'>
                            <h1 className='text-center mt-7 text-2xl font-semibold'>
                                Your Listings
                            </h1>
                            {userListings.map((listing) => (
                                <div
                                    key={listing._id}
                                    className='border rounded-lg p-3 flex justify-between items-center gap-4'
                                >
                                    <Link to={`/listing/${listing._id}`}>
                                        <img
                                            src={listing.imageUrls[0]}
                                            alt='listing cover'
                                            className='h-16 w-16 object-contain'
                                        />
                                    </Link>
                                    <Link
                                        className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                                        to={`/listing/${listing._id}`}
                                    >
                                        <p>{listing.name}</p>
                                    </Link>

                                    <div className='flex flex-col item-center'>
                                        <button
                                            onClick={() => handleListingDelete(listing._id)}
                                            className='text-red-700 uppercase'
                                        >
                                            Delete
                                        </button>
                                        <Link to={`/update-listing/${listing._id}`}>
                                            <button className='text-green-700 uppercase'>Edit</button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}
