# Generated by Django 5.0.2 on 2024-03-12 23:50

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_remove_profile_address_remove_profile_email_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='zip_code',
            field=models.CharField(blank=True, max_length=9, validators=[django.core.validators.RegexValidator(code='invalid_zip_code', message='Zip code must be either 5 or 9 digits.', regex='^\\d{5}(\\d{4})?$')]),
        ),
    ]