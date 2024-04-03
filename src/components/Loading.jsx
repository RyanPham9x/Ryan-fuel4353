import React from 'react';
import { cardio } from 'ldrs'
import { MDBCard, MDBCardBody, MDBCardText } from 'mdb-react-ui-kit';

const LoadingSpinner = () => {
  cardio.register()
  return (
    <MDBCard className="text-center">
      <MDBCardBody>
        <MDBCardText>
          <l-cardio
            size="60"
            stroke="2"
            speed="0.7"
            color="black"
          ></l-cardio>
          <p>Loading...</p>
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
};
export default LoadingSpinner;
