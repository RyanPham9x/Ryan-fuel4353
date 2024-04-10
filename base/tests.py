from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from base.models import Profile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from unittest.mock import patch
from .serializer import *
import datetime

class MyTokenObtainPairViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.url = reverse('token_obtain_pair')

    def test_token_obtain_success(self):
        response = self.client.post(self.url, {'username': 'testuser', 'password': 'password'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_token_obtain_fail(self):
        response = self.client.post(self.url, {'username': 'wronguser', 'password': 'password'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.profile = Profile.objects.create(user=self.user)
        self.client.force_authenticate(user=self.user)
        self.url = reverse('profile_view')

    def test_get_profile_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_profile_creation(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 

    def test_patch_profile_update(self):
        response = self.client.patch(self.url, {'field_to_update': 'new_value'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_profile_existing_profile(self):
        # Attempt to create another profile for the same user
        data = {
            'full_name': 'Test User',
            'addressOne': '123 Test Street',
            'city': 'Test City',
            'state': 'TS',
            'zip_code': '12345'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'Profile already exists'})


class UserRegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('register')

    def test_user_registration_success(self):
        data = {
            'username': 'newuser',
            'password': 'test123@@',
            'password2': 'test123@@'  # Passwords match
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())  # Check the user was created

    def test_passwords_do_not_match(self):
        data = {
            'username': 'testuser',
            'password': 'test321pw##',
            'password2': 'test321##'  # Passwords do not match
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data['errors'])  # Now correctly accessing the nested 'errors' key

        # If you want to check for a specific error message related to password strength, adjust accordingly
        password_errors = response.data['errors']['password']
        self.assertTrue(any("Password fields didn't match" in error for error in password_errors))


    def test_missing_required_fields(self):
        data = {
            'password': 'test123@@',
            'password2': 'test123@@'  # Missing username
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Adjusted check for username error in response to match the structure
        self.assertIn('username', response.data['errors'])  
        self.assertEqual(response.data['errors']['username'][0].code, 'required')


    def test_invalid_password1(self):
        data = {
            'username': 'userweakpw',
            'password': '123456789',  # Password is entirely numeric
            'password2': '123456789'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Adjust the assertion to match the nested structure under 'errors' key
        self.assertIn('password', response.data['errors'])

        password_errors = response.data['errors']['password']
        self.assertTrue(any("This password is entirely numeric." in error for error in password_errors))
        

    def test_invalid_password2(self):
    # This test assumes 'validate_password' enforces certain strength requirements.
        data = {
            'username': 'userweakpw',
            'password': 'testxab',  # Example of a short password. Must be at least 8 characters.
            'password2': 'testxab'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data['errors'])

        password_errors = response.data['errors']['password']
        self.assertTrue(any("This password is too short." in error for error in password_errors))

class TestViews(APITestCase):

    def setUp(self):
        # Create a user for authenticated tests
        self.user = User.objects.create_user(username='testauser', password='test123@@')
        self.token = RefreshToken.for_user(self.user)
    
    def authenticate(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token.access_token}')

    def test_profile_view_get_not_found(self):
        self.authenticate()
        url = reverse('profile_view')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_submit_quote_unauthenticated(self):
        url = reverse('submit_quote')
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_quote_history_empty(self):
        self.authenticate()
        url = reverse('quote_history')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])  # Assuming no quotes exist yet

    def test_get_quote_price(self):
        self.authenticate()
        url = reverse('get_quote_price')
        data = {
            'location': 'TX',
            'gallons_requested': 500
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('suggested_price', response.json())
        self.assertIn('total_amount_due', response.json())
        
class SubmitQuoteTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.profile = Profile.objects.create(user=self.user, 
                                              full_name='Test User',
                                              addressOne='123 Main St',
                                              addressTwo='Apt 1',
                                              city='Anytown',
                                              state='TX',
                                              zip_code='12345')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.quote_url = reverse('submit_quote')
        delivery_address = f"{self.profile.addressOne} {self.profile.addressTwo}, {self.profile.city}, {self.profile.state}, {self.profile.zip_code}"
        self.valid_quote_data = {
            'delivery_address': delivery_address,
            'gallons_requested': 1000,
            'delivery_date': '2055-12-12',
            'price_per_gallon': 2.00,
            'total_amount_due': 2000.0
        }
        self.invalid_quote_data = {
            'delivery_address': '   ',  # Invalid because delivery address is empty
            'gallons_requested': 1000,
            'delivery_date': datetime.date.today() + datetime.timedelta(days=1),
            'price_per_gallon': 2.00,
            'total_amount_due': 2000.0
        }
   
    def test_submit_quote_with_valid_data(self):
        response = self.client.post(self.quote_url, self.valid_quote_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.data)

        # Iterate over each key-value pair in the valid quote data
        for key, value in self.valid_quote_data.items():
            if key in response.data:
                # If the value is numeric, convert both the expected and actual values to floats for comparison
                if isinstance(value, (int, float)):
                    self.assertEqual(float(response.data[key]), float(value))
                else:
                    self.assertEqual(response.data[key], value)

    def test_submit_quote_with_invalid_data(self):
        response = self.client.post(self.quote_url, self.invalid_quote_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('delivery_address', response.data)
        self.assertIn('This field may not be blank.', response.data['delivery_address'])

    def test_invalid_total_amount_due(self):
        invalid_data = {
            'user': self.user.id,
            'gallons_requested': 500,
            'delivery_address': '123 Test Lane, Test City, TX, 12345',
            'delivery_date': '2055-12-12', 
            'price_per_gallon': 2.00,
            'total_amount_due': -1000.00 #total amount due is negative
        }
        serializer = QuoteSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('total_amount_due', serializer.errors)
        self.assertEqual(serializer.errors['total_amount_due'][0], "Total amount due must be positive.")

    def test_delivery_date_in_the_past(self):
        # Test with a delivery date in the past
        invalid_data = {
            'user': self.user.id,
            'gallons_requested': 500,
            'delivery_address': '123 Test Lane, Test City, TX, 12345',
            'delivery_date': '2021-12-12',  # Past date
            'price_per_gallon': 2.00,
            'total_amount_due': 1000.00
        }
        serializer = QuoteSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('delivery_date', serializer.errors)
        self.assertEqual(serializer.errors['delivery_date'][0], "Delivery date cannot be in the past.")

class QuoteSerializerValidationTests(TestCase):
    def test_direct_gallons_requested_validation(self):
        serializer = QuoteSerializer()

        with self.assertRaises(serializers.ValidationError) as context:
            serializer.validate_gallons_requested(-1)  # Test negative value
        self.assertIn("Gallons requested must be between 0 and 10,000,000.", str(context.exception))

        with self.assertRaises(serializers.ValidationError) as context:
            serializer.validate_gallons_requested(10000001)  # Test value too high
        self.assertIn("Gallons requested must be between 0 and 10,000,000.", str(context.exception))


class CurrentPricePerGallonTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    @patch('base.api.pricing.get_price_per_gallon') 
    def test_current_price_per_gallon(self, mock_get_price_per_gallon):

        url = reverse('current_price_per_gallon') 

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"current_price_per_gallon": 1.5})


class ProfileSerializerTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
    
    def test_full_name_validation(self):
        # Testing full_name length validation
        data = {'full_name': 'a' * 51, 'addressOne': 'Test Address', 'city': 'Test City', 'state': 'TS', 'zip_code': '12345'}
        serializer = ProfileSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('full_name', serializer.errors)

    def test_required_field_full_name_blank(self):
        # Testing required full_name field left blank
        data = {
            'full_name': '',  # Required field left blank
            'addressOne': '123 Main St',
            'city': 'Anytown',
            'state': 'AN',
            'zip_code': '12345'
        }
        serializer = ProfileSerializer(data=data)
        self.assertFalse(serializer.is_valid(), "Serializer should not be valid when required 'full_name' is left blank")
        self.assertIn('full_name', serializer.errors, "Validation error should include 'full_name'")
        self.assertRegex(str(serializer.errors['full_name'][0]), 'This field may not be blank.', "Error message should indicate that the 'full_name' field cannot be blank")

    def test_zip_code_validation(self):
        # Testing zip_code length validation
        invalid_zip_codes = ['1234', '123456', '1234567890']
        for zip_code in invalid_zip_codes:
            data = {'full_name': 'Test Name', 'addressOne': 'Test Address', 'addressTwo': '', 
                    'city': 'Test City', 'state': 'TS', 'zip_code': zip_code}
            serializer = ProfileSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('zip_code', serializer.errors)

        valid_zip_code = '123456789'
        data.update({'zip_code': valid_zip_code})
        serializer = ProfileSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_state_validation(self):
        # Testing state length validation
        data = {'full_name': 'Test Name', 'addressOne': 'Test Address', 'city': 'Test City', 'state': 'TXA', 'zip_code': '12345'}
        serializer = ProfileSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('state', serializer.errors)

    def test_addressOne_validation(self):
        # Test case for addressOne being too long
        data_too_long = {
            'full_name': 'Test Name',
            'addressOne': 'a' * 101,  # 101 characters long, exceeding the limit
            'city': 'Test City',
            'state': 'TS',
            'zip_code': '12345'
        }
        serializer = ProfileSerializer(data=data_too_long)
        self.assertFalse(serializer.is_valid())
        self.assertIn('addressOne', serializer.errors)
        self.assertEqual(serializer.errors['addressOne'][0].code, 'max_length')

        # Test case for full profile being just right length
        data_valid_length = {
            'full_name': 'a'*50,
            'addressOne': 'b' * 100, 
            'addressTwo': 'c' * 100, 
            'city': 'd'*100,
            'state': 'TS',
            'zip_code': '123456789'
        }
        serializer = ProfileSerializer(data=data_valid_length)
        self.assertTrue(serializer.is_valid(), msg=serializer.errors)