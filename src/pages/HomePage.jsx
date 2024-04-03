import ProfileHook from "../context/ProfileHook";
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

export default function HomePage() {
  const { profile, profileLoaded } = ProfileHook();
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
                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <div className="title">
                      <h3>Your Profile</h3>
                    </div>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="4">
                        <MDBCardText className='text-start fw-bold'>Full Name</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="8">
                        <MDBCardText className='text-start'>{profile.full_name} {profile.last_name}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="4">
                        <MDBCardText className='text-start fw-bold'>Address Line 1</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="8">
                        <MDBCardText className='text-start'>{profile.addressOne}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="4">
                        <MDBCardText className='text-start fw-bold'>Address Line 2</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="8">
                        <MDBCardText className='text-start'>{profile.addressTwo}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="4">
                        <MDBCardText className='text-start fw-bold'>City</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="8">
                        <MDBCardText className='text-start'>{profile.city}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="4">
                        <MDBCardText className='text-start fw-bold'>State</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="8">
                        <MDBCardText className='text-start'>{profile.state}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="4">
                        <MDBCardText className='text-start fw-bold'>Zip Code</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="8">
                        <MDBCardText className='text-start'>{profile.zip_code}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBBtn href='/profile' type="button"
                      outline rounded color="secondary">Edit Profile</MDBBtn>
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
}