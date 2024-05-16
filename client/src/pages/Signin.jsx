import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function Signin() {

    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.id]: event.target.value });
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            dispatch(signInStart());
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message))
                return;
            }
            dispatch(signInSuccess(data));
            navigate('/')
            // console.log(data);
        } catch (error) {
            dispatch(signInFailure(data.message))
        }
    }
    // console.log(formData);
    return (
        <div className='p-3 max-w-lg mx-auto'>

            <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

                <input type="email" placeholder='EmailID' className='border p-3 rounded-lg focus:outline-none' id='email' onChange={handleChange} />
                <input type="password" placeholder='Password' className='border p-3 rounded-lg focus:outline-none' id='password' onChange={handleChange} />
                <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    {loading ? 'Loading...' : 'Sign In'}

                </button>

            </form>

            <div className="flex gap-2 mt-5">

                <p>Dont Have an account?</p>

                <Link to={'/sign-up'}>
                    <span className="text-blue-700">Sign up</span>
                </Link>

            </div>
            {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    )
}
