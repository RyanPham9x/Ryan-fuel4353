import React, { useState, useContext, useEffect } from 'react';
import ProfileHook from '../context/ProfileHook';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import "../FuelQuoteForm.css";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBBtn
} from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import LoadingSpinner from "../components/Loading";
import ProfileUpdateCard from '../components/ProfileUpdateCard';


const QuoteForm = () => {
  const { profile, profileLoaded } = ProfileHook();
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [gallonsRequested, setGallonsRequested] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [pricePerGallon] = useState('1.50'); // Assuming a mock price per gallon
  const [totalAmountDue, setTotalAmountDue] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When the profile is loaded, construct the delivery address
    if (profileLoaded && profile) {
      const fullAddress = `${profile.addressOne} ${profile.addressTwo}, ${profile.city}, ${profile.state} ${profile.zip_code}`;
      setDeliveryAddress(fullAddress.trim()); // Trim in case some fields are empty
    }
  }, [profile, profileLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile) {
      toast.error('You must update your profile to submit a quote.');
      setTimeout(() => navigate('/profile/'), 1600);
      return;
    }

    const quoteData = {
      user: profile.user,
      gallons_requested: gallonsRequested,
      delivery_address: deliveryAddress,
      delivery_date: deliveryDate,
      price_per_gallon: pricePerGallon,
      total_amount_due: totalAmountDue,
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/quotes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(quoteData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Quote submitted successfully.');
        setTimeout(() => navigate('/quotehistory'), 1600);
      } else {

        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit quote.');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while submitting the quote.');
    }
    // Submit the quoteData to the backend API
    //console.log('Submitting quote:', quoteData);
  };

  const handleGetQuote = async () => {
    setIsLoading(true);
    if (!profile) {
      toast.error('You must update your profile to submit a quote.');
      setTimeout(() => navigate('/profile/'), 1600);
      return;
    }
    const quoteData = {
      location: profile.state,
      gallons_requested: gallonsRequested,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/getquote/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSuggestedPrice(data.suggested_price);
      setTotalAmountDue(data.total_amount_due);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred while fetching the quote.");
    }

    setIsLoading(false); // Stop loading indicator
  };


  return (
    <section style={{ backgroundColor: '#eee' }}>

      <MDBContainer className="py-5 fluid">
        <MDBRow>
          <MDBCol lg="2"></MDBCol>
          <MDBCol lg="8">
            {!profileLoaded ? (
              <LoadingSpinner />
            ) : (
              profile ? (
                <MDBCard>
                  <MDBCardBody>
                    <div className="title">
                      <h3>Request a Fuel Quote</h3>
                    </div>
                    <hr />
                    <form onSubmit={handleSubmit}>
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText className='text-start fw-bold'>Delivery Address</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="6">
                          <MDBCardText className='text-start'>{deliveryAddress}</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText className='text-start fw-bold'>Delivery Date</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="4">
                          <input
                            type="date"
                            id="deliveryDate"
                            className="form-control"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            required
                          />
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText className='text-start fw-bold'>Gallons Requested</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="4">
                          <input
                            type="number"
                            min="0"
                            id="gallonsRequested"
                            className="form-control"
                            value={gallonsRequested}
                            onChange={(e) => setGallonsRequested(Number(e.target.value))}
                            required
                          />
                        </MDBCol>
                      </MDBRow>
                      <hr />

                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText className='text-start fw-bold'>Price/Gallon</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="4">
                          <input
                            type="text"
                            id="pricePerGallon"
                            className="form-control"
                            value={pricePerGallon}
                            disabled={true} // This field is not editable
                          />
                        </MDBCol>
                      </MDBRow>
                      <hr />

                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText className='text-start fw-bold'>Suggested Price</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="4">
                          <input
                            type="text"
                            id="suggestedPrice"
                            className="form-control"
                            value={suggestedPrice}
                            disabled={true} // This field is not editable
                            readOnly
                          />
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText className='text-start fw-bold'>Total Amount Due</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="4">
                          <input
                            type="text"
                            id="totalAmountDue"
                            className="form-control"
                            value={totalAmountDue}
                            disabled={true} // This field is not editable
                            readOnly
                          />
                        </MDBCol>
                      </MDBRow>
                      <hr />

                      <MDBRow>
                        <MDBCol md="3">
                        </MDBCol>

                        <MDBCol md="4">
                          <p>Step 1</p>
                          <MDBBtn onClick={handleGetQuote} class="btn btn-success"
                            disabled={!gallonsRequested || isLoading}
                            style={{ backgroundColor: '#20d489' }}>Get Quote</MDBBtn>
                        </MDBCol>

                        <MDBCol md="4">
                          <p>Step 2</p>
                          <MDBBtn type='submit' class="btn btn-success"
                            style={{ backgroundColor: '#20d489' }}
                            disabled={
                              !gallonsRequested ||
                              !deliveryDate ||
                              !suggestedPrice ||
                              !totalAmountDue ||
                              isLoading // Optional: Also disable the button while loading
                            }>Submit Quote</MDBBtn>
                        </MDBCol>
                      </MDBRow>
                    </form>
                  </MDBCardBody>
                </MDBCard>
              ) : (
                <ProfileUpdateCard />
              )

            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default QuoteForm;