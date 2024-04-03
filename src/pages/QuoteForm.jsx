import React, { useState, useEffect } from 'react';
import ProfileHook from '../context/ProfileHook';
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

import LoadingSpinner from "../components/Loading";
import ProfileUpdateCard from '../components/ProfileUpdateCard';
import QuoteFormHook from '../context/QuoteFormHook';

const QuoteForm = () => {

  const [LockedInput, setLockedInput] = useState(false);
  const [gallonsRequested, setGallonsRequested] = useState('');
  const [gallonsError, setGallonsError] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const { profile, profileLoaded } = ProfileHook();
  const { handleGetQuote, handleSubmitQuote, isLoading, suggestedPrice, totalAmountDue } = QuoteFormHook(profile);

  //const [pricePerGallon, setPricePerGallon] = useState('');;

  useEffect(() => {
    // When the profile is loaded, construct the delivery address
    if (profileLoaded && profile) {
      let fullAddress = `${profile.addressOne}`;
      if (profile.addressTwo) {
        fullAddress += `, ${profile.addressTwo}`;
      }
      fullAddress += `, ${profile.city}, ${profile.state} ${profile.zip_code}`;
      setDeliveryAddress(fullAddress.trim()); // Trim in case some fields are empty
    }
  }, [profile, profileLoaded]);

  /*useEffect(() => {//Get the current price per gallon from back end
    const fetchPricePerGallon = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/ppg/`);
        if (!response.ok) {
          throw new Error('Failed to fetch the current price per gallon.');
        }
        const data = await response.json();
        setPricePerGallon(data.current_price_per_gallon); //
        //console.log('Price per gallon:', data.current_price_per_gallon);
      } catch (error) {
        console.error('Error fetching price per gallon:', error);
      }
    };

    fetchPricePerGallon();
  }, []);*/

  const handleGallonsChange = (e) => {
    const value = e.target.value;
    const intValue = parseInt(value, 10);

    // Check if the value is an integer, greater than 0, and within the acceptable range
    if (value === '' || (!isNaN(intValue) && intValue.toString() === value && intValue > 0 && intValue <= 10000000)) {
      setGallonsRequested(intValue);
      setGallonsError(''); // Clear error if input is valid
    } else if (intValue > 10000000) {
      // Set error message if the input is larger than 10,000,000
      setGallonsError('Gallons requested must be less than 10,000,000');
    } else if (intValue <= 0) {
      // Set error message if the input is 0 or negative
      setGallonsError('Gallons requested must be greater than 0');
    } else {
      // Set error message if the input is not an integer
      setGallonsError('Gallons requested must be an integer');
    }
  };
  // Calculate today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <section style={{ backgroundColor: '#eee' }}>

      <MDBContainer className="py-5 fluid">
        <MDBRow>
          <MDBCol lg="3"></MDBCol>
          <MDBCol lg="6">
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
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const quoteData = {
                        user: profile.user,
                        gallons_requested: gallonsRequested,
                        delivery_address: deliveryAddress,
                        delivery_date: deliveryDate,
                        price_per_gallon: suggestedPrice,
                        total_amount_due: totalAmountDue,
                      };
                      handleSubmitQuote(quoteData);
                    }}>
                      <MDBRow>
                        <MDBCol sm="4">
                          <MDBCardText className='text-start fw-bold'>Delivery Address</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="8">
                          <MDBCardText className='text-start'>{deliveryAddress}</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="4">
                          <MDBCardText className='text-start fw-bold'>Delivery Date</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="6">
                          <input
                            type="date"
                            id="deliveryDate"
                            className="form-control"
                            min={today}
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            disabled={LockedInput}
                            required
                          />
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="4">
                          <MDBCardText className='text-start fw-bold'>Gallons Requested</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="6">
                          <input
                            type="number"
                            min="0"
                            max="10000000" // Set the maximum value for the input
                            id="gallonsRequested"
                            className={`form-control ${gallonsError ? 'is-invalid' : ''}`}
                            value={gallonsRequested}
                            onChange={handleGallonsChange}
                            required
                            disabled={LockedInput}
                          />
                          {gallonsError && <div className="error-msg">{gallonsError}</div>}
                        </MDBCol>
                      </MDBRow>
                      <hr />

                      {/* <MDBRow>
                        <MDBCol sm="4">
                          <MDBCardText className='text-start fw-bold'>Price per Gallon</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="6">
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                              type="text"
                              id="pricePerGallon"
                              className="form-control"
                              //value={pricePerGallon || 'N/A'}
                              value={new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(pricePerGallon) || 'N/A'}
                              disabled={true} // This field is not editable
                            />
                          </div>
                        </MDBCol>
                      </MDBRow>
                  <hr />*/}

                      <MDBRow>
                        <MDBCol sm="4">
                          <MDBCardText className='text-start fw-bold'>Suggested Price/Gallon</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="6">
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                              type="text"
                              id="suggestedPrice"
                              className="form-control"
                              value={new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(suggestedPrice)}
                              disabled={true} // This field is not editable
                              readOnly
                            />
                          </div>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="4">
                          <MDBCardText className='text-start fw-bold'>Total Amount Due</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="6">
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                              type="text"
                              id="totalAmountDue"
                              className="form-control"
                              // Use Intl.NumberFormat to format the totalAmountDue value with commas
                              value={new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalAmountDue)}
                              disabled={true} // This field is not editable
                              readOnly
                            />
                          </div>
                        </MDBCol>
                      </MDBRow>
                      <hr />

                      <MDBRow>
                        <MDBCol md="2">
                        </MDBCol>

                        <MDBCol md="4">
                          <p>Step 1</p>
                          <MDBBtn onClick={() => {
                            handleGetQuote(gallonsRequested);
                            setLockedInput(true); // Lock the field after fetching the quote
                          }}
                            outline rounded color="secondary"
                            disabled={!gallonsRequested || !deliveryDate || isLoading || LockedInput
                            }
                          >Get Quote</MDBBtn>
                        </MDBCol>

                        <MDBCol md="4">
                          <p>Step 2</p>
                          <MDBBtn type='submit' outline rounded color="secondary"
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
