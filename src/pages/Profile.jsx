import React, { useState, useContext, useEffect } from 'react';
import '../FuelQuoteForm.css';
import AuthContext from '../context/AuthContext';
import ProfileHook from "../context/ProfileHook";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBBtn
} from 'mdb-react-ui-kit';
import LoadingSpinner from "../components/Loading";

function Profile() {
    const { profile, profileLoaded } = ProfileHook();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profileExists, setProfileExists] = useState(false);

    const [fullName, setFullName] = useState('');
    const [addressOne, setAddressOne] = useState('');
    const [addressTwo, setAddressTwo] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    //Input validation for handling errors
    const [fullNameError, setFullNameError] = useState('');
    const [addressOneError, setAddressOneError] = useState('');
    const [addressTwoError, setAddressTwoError] = useState('');
    const [cityError, setCityError] = useState('');

    const handleFullNameChange = (e) => {
        const value = e.target.value;
        setFullName(value); // Update state

        // Validate Full Name
        if (!value.trim()) {
            setFullNameError('Full Name is required');
        } else if (value.length > 50) {
            setFullNameError('Full Name must be less than 50 characters');
        } else {
            setFullNameError(''); // Clear error
        }
    };

    const handleAddressOneChange = (e) => {
        const value = e.target.value;
        setAddressOne(value); // Update state

        // Validate Address 1
        if (!value.trim()) {
            setAddressOneError('Address Line 1 is required');
        } else if (value.length > 100) {
            setAddressOneError('Address Line 1 must be less than 100 characters');
        } else {
            setAddressOneError(''); // Clear error
        }
    };

    const handleAddressTwoChange = (e) => {
        const value = e.target.value;
        setAddressTwo(value); // Update state

        // Validate Address 2 (optional)
        if (value.length > 100) {
            setAddressTwoError('Address Line 2 must be less than 100 characters');
        } else {
            setAddressTwoError(''); // Clear error
        }
    };

    const handleCityChange = (e) => {
        const value = e.target.value;
        setCity(value); // Update state

        // Validate City
        if (!value.trim()) {
            setCityError('City is required');
        } else if (value.length > 100) {
            setCityError('City must be less than 100 characters');
        } else {
            setCityError(''); // Clear error
        }
    };

    const handleZipChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 9);
        setZipCode(value);
    };


    const states = [
        { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" },
        { code: "AZ", name: "Arizona" }, { code: "AR", name: "Arkansas" },
        { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
        { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" },
        { code: "FL", name: "Florida" }, { code: "GA", name: "Georgia" },
        { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
        { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" },
        { code: "IA", name: "Iowa" }, { code: "KS", name: "Kansas" },
        { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
        { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" },
        { code: "MA", name: "Massachusetts" }, { code: "MI", name: "Michigan" },
        { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
        { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" },
        { code: "NE", name: "Nebraska" }, { code: "NV", name: "Nevada" },
        { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
        { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" },
        { code: "NC", name: "North Carolina" }, { code: "ND", name: "North Dakota" },
        { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
        { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" },
        { code: "RI", name: "Rhode Island" }, { code: "SC", name: "South Carolina" },
        { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
        { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" },
        { code: "VT", name: "Vermont" }, { code: "VA", name: "Virginia" },
        { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
        { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
        { code: "DC", name: "District of Columbia" }, { code: "PR", name: "Puerto Rico" }
    ];

    useEffect(() => {
        // Once the profile data is loaded, check if the profile exists
        if (profileLoaded && profile) {
            setFullName(profile.full_name || '');
            setAddressOne(profile.addressOne || '');
            setAddressTwo(profile.addressTwo || '');
            setCity(profile.city || '');
            setState(profile.state || '');
            setZipCode(profile.zip_code || '');
            setProfileExists(true);
        }
    }, [profile, profileLoaded]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for validation errors before proceeding
        if (fullNameError || addressOneError || addressTwoError || cityError) {
            toast.error('Please correct the errors before submitting.');
            return; // Stop the form submission
        }

        const method = profileExists ? 'PATCH' : 'POST';

        const profileData = {
            full_name: fullName,
            addressOne: addressOne,
            addressTwo: addressTwo,
            city: city,
            state: state,
            zip_code: zipCode,
        };

        // Use the authTokens for the Authorization header
        if (authTokens) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/profile/`, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                    body: JSON.stringify(profileData),
                });

                if (response.ok) {
                    toast.success('Profile updated successfully.');
                    setProfileExists(true); // Ensure future submissions use PATCH
                    setTimeout(() => navigate('/'), 1600);
                } else {
                    throw new Error('Failed to update profile.');
                }
            } catch (error) {
                toast.error(error.message || 'An error occurred.');
            }
        } else {
            toast.error("You're not logged in.");
        }
    };


    return (
        <section style={{ backgroundColor: '#eee' }}>

            <MDBContainer className="py-5 fluid">
                <MDBRow>
                    <MDBCol lg="3"></MDBCol>
                    <MDBCol lg="6">
                        {!profileLoaded ? (
                            <LoadingSpinner />
                        ) : (
                            <MDBCard >
                                <MDBCardBody>
                                    <div className="title">
                                        <h3>Edit Your Profile</h3>
                                    </div><hr />
                                    <form onSubmit={handleSubmit}>
                                        <MDBRow>
                                            <MDBCol sm="4">
                                                <MDBCardText className='text-start fw-bold'>Full Name</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="7">
                                                <input type="text" className="form-control"
                                                    id="fullName" placeholder="Full Name" value={fullName}
                                                    onChange={handleFullNameChange} required />
                                                {fullNameError && <div className="error-msg">{fullNameError}</div>}
                                            </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                            <MDBCol sm="4">
                                                <MDBCardText className='text-start fw-bold'>Address Line 1</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="7">
                                                <input type="text" className="form-control"
                                                    id="addressOne" placeholder="Address 1" value={addressOne}
                                                    onChange={handleAddressOneChange} required />
                                                {addressOneError && <div className="error-msg">{addressOneError}</div>}
                                            </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                            <MDBCol sm="4">
                                                <MDBCardText className='text-start fw-bold'>Address Line 2</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="7">
                                                <input type="text" className="form-control"
                                                    id="addressTwo" placeholder="Address 2" value={addressTwo}
                                                    onChange={handleAddressTwoChange} />
                                                {addressTwoError && <div className="error-msg">{addressTwoError}</div>}
                                            </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                            <MDBCol sm="4">
                                                <MDBCardText className='text-start fw-bold'>City</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="7">
                                                <input type="text" className="form-control"
                                                    id="city" placeholder="City" value={city}
                                                    onChange={handleCityChange} required />
                                                {cityError && <div className="error-msg">{cityError}</div>}
                                            </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                            <MDBCol sm="4">
                                                <MDBCardText className='text-start fw-bold'>State</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="7">
                                                <select className="form-control" id="state" value={state}
                                                    onChange={(e) => setState(e.target.value)} required>
                                                    <option value="">Select state</option> {/**disabled */}
                                                    {states.map((state) => (
                                                        <option key={state.code} value={state.code}>{state.name}</option>
                                                    ))}
                                                </select>
                                            </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                            <MDBCol sm="4">
                                                <MDBCardText className='text-start fw-bold'>Zip Code</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="7">
                                                <input type="text" className="form-control" id="zipCode"
                                                    placeholder="Zip code"
                                                    value={zipCode}
                                                    onChange={handleZipChange}
                                                    pattern="\d{5}(\d{4})?"
                                                    title="Zip code must be either 5 or 9 digits."
                                                    maxLength="9"
                                                    minLength="5"
                                                    required />
                                            </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBBtn type="submit" outline rounded color="secondary"
                                        >Update Profile</MDBBtn>
                                    </form>
                                </MDBCardBody>
                            </MDBCard>
                        )}
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    )
}

export default Profile;