import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Signout from "./pages/Signout";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import CreateRepairRequest from "./pages/CreateRepairRequest";
import OwnerRepairRequests from "./pages/OwnerRepairRequest";
import UserRepairRequests from "./pages/UserRepairRequests";

export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<Signin />} />
                <Route path="/sign-out" element={<Signout />} />
                <Route path="/sign-up" element={<Signup />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/search" element={<Search />} />
                <Route path="/listing/:listingId" element={<Listing />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create-listing" element={<CreateListing />} />
                    <Route path="/update-listing/:listingId" element={<UpdateListing />} />
                    <Route path="/create-repair-request/:listingId" element={<CreateRepairRequest />} />
                    <Route path="/view-repair-request" element={<OwnerRepairRequests />} />
                    <Route path="/user-repair-request" element={<UserRepairRequests />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
