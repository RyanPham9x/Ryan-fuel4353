from rest_framework import serializers
from base.models import *
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    full_name = serializers.CharField(max_length=50)
    addressOne = serializers.CharField(max_length=100)
    addressTwo = serializers.CharField(max_length=100, allow_blank=True, required=False)  #addressTwo can be optional
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(min_length=2, max_length=2)
    zip_code = serializers.CharField()

    class Meta:
        model = Profile
        fields = ('user', 'full_name', 'addressOne', 'addressTwo', 'city', 'state', 'zip_code')

    def validate_zip_code(self, value):
        if not (len(value) == 5 or len(value) == 9):
            raise serializers.ValidationError("Zip code must be 5 or 9 characters long.")
        return value
    
class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[
            RegexValidator(
                regex='^[a-zA-Z0-9]*$',
                message='Username must be alphanumeric',
                code='invalid_username'
            )
        ],
        min_length=4,
        max_length=50
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")

    class Meta:
        model = User
        fields = ('username', 'password', 'password2')
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2', None)  # Remove confirm password from validated data
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already in use. Please choose a different one.")
        return value

class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteForm
        fields = '__all__'
        read_only_fields = ('user',)  
        
    def validate_gallons_requested(self, value):
        if value < 0 or value > 10000000:
            raise serializers.ValidationError("Gallons requested must be between 0 and 10,000,000.")
        return value

    def validate_delivery_date(self, value):
        # Delivery date must not be in the past.
        import datetime
        if value < datetime.date.today():
            raise serializers.ValidationError("Delivery date cannot be in the past.")
        return value

    def validate(self, attrs):
        # Ensure price_per_gallon and total_amount_due are positive.
        if attrs['price_per_gallon'] <= 0:
            raise serializers.ValidationError({"price_per_gallon": "Price per gallon must be positive."})
        if attrs['total_amount_due'] <= 0:
            raise serializers.ValidationError({"total_amount_due": "Total amount due must be positive."})
        return attrs
