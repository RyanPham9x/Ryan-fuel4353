import React from 'react';
import { MDBFooter } from 'mdb-react-ui-kit';

export default function Footer() {
  return (
    <MDBFooter className='text-center text-lg-left fixed-bottom '>
      <div className='text-center p-3 text-secondary' style={{ backgroundColor: 'white' }}>
        &copy; {new Date().getFullYear()} Copyright:{' '}
        CS4353 Group 52
      </div>
    </MDBFooter>
  );
}