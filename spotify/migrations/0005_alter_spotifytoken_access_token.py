# Generated by Django 4.0.1 on 2022-01-21 01:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify', '0004_alter_spotifytoken_expires_in'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spotifytoken',
            name='access_token',
            field=models.CharField(max_length=150, null=True),
        ),
    ]
