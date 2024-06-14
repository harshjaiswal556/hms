import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Header() {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);

    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }
    return (
        <header className='bg-slate-200 shadow-md'>

            <div className="flex justify-between items-center max-w-6xl mx-auto p-4">

                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-500'>Nacro</span>
                        <span className='text-slate-700'>Estate</span>
                    </h1>
                </Link>

                <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <button>
                        <FaSearch className='text-slate-700' />
                    </button>
                </form>

                <ul className='flex gap-4'>

                    <Link to='/'>
                        <li className='hidden sm:inline text-slate-700 hover:text-slate-500 cursor-pointer'>Home</li>
                    </Link>
                    <Link to='/requests'>
                        <li className='hidden sm:inline text-slate-700 hover:text-slate-500 cursor-pointer'>Rental Requests</li>
                    </Link>
                    <div className="relative">
                        <li
                            className='text-slate-700 hover:text-slate-500 cursor-pointer'
                            onClick={toggleDropdown}
                        >
                            Repair Requests<ArrowDropDownIcon />
                        </li>
                        {dropdownOpen && (
                            <ul className="absolute bg-white shadow-lg rounded-lg mt-2 w-48 right-0">
                                <li className="px-4 py-2 hover:bg-slate-200 cursor-pointer">
                                    <Link to='/user-repair-request'>View Your Requests</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-slate-200 cursor-pointer">
                                    <Link to='/view-repair-request'>View Others' Requests</Link>
                                </li>
                            </ul>
                        )}
                    </div>
                    <Link to='/profile'>
                        {currentUser ? (
                            <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='Profile' />
                        ) : (
                            <li className='text-slate-700 hover:text-slate-500 cursor-pointer'>Sign in</li>
                        )}
                    </Link>
                </ul>
            </div>

        </header>
    )
}
