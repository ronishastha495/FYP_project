import random
from django.core.management.base import BaseCommand
from services.models import Servicing, Vehicle
from decimal import Decimal

class Command(BaseCommand):
    help = 'Create test data for services and vehicles'

    def handle(self, *args, **options):
        self.create_services()
        self.create_vehicles()
        self.stdout.write(self.style.SUCCESS('Successfully created test data'))

    def create_services(self):
        # Clear existing services first
        if Servicing.objects.exists():
            self.stdout.write('Services already exist, skipping creation')
            return

        services = [
            {
                'name': 'Basic Oil Change',
                'description': 'Complete oil change with synthetic blend oil, new filter, and 20-point inspection.',
                'cost': Decimal('49.99')
            },
            {
                'name': 'Full Synthetic Oil Change',
                'description': 'Premium oil change with full synthetic oil, new filter, and 20-point inspection.',
                'cost': Decimal('69.99')
            },
            {
                'name': 'Brake Service',
                'description': 'Inspection, pad replacement, rotor resurfacing, and brake fluid check.',
                'cost': Decimal('199.99')
            },
            {
                'name': 'Wheel Alignment',
                'description': 'Complete four-wheel alignment with printout of before/after measurements.',
                'cost': Decimal('89.99')
            },
            {
                'name': 'Tire Rotation',
                'description': 'Rotation of all four tires to ensure even wear and maximum tire life.',
                'cost': Decimal('29.99')
            },
            {
                'name': 'Engine Tune-Up',
                'description': 'Comprehensive engine tune-up including spark plugs, filters, and fuel system cleaning.',
                'cost': Decimal('149.99')
            },
            {
                'name': 'A/C Service',
                'description': 'Inspection, refrigerant recharge, and system performance test.',
                'cost': Decimal('119.99')
            }
        ]

        for service_data in services:
            Servicing.objects.create(**service_data)
            self.stdout.write(f'Created service: {service_data["name"]}')

    def create_vehicles(self):
        # Only create vehicles if we don't have enough
        if Vehicle.objects.count() >= 5:
            self.stdout.write('Enough vehicles already exist, skipping creation')
            return

        # Demo dealership vehicles (not customer owned)
        vehicles = [
            {
                'make': 'Toyota',
                'model': 'Camry',
                'year': '2023',
                'vin': f'JT2SK12E{random.randint(1000000, 9999999)}'
            },
            {
                'make': 'Honda',
                'model': 'Accord',
                'year': '2022',
                'vin': f'1HGCM82{random.randint(1000000, 9999999)}'
            },
            {
                'make': 'Ford',
                'model': 'F-150',
                'year': '2021',
                'vin': f'1FTEW1EP{random.randint(100000, 999999)}'
            },
            {
                'make': 'Tesla',
                'model': 'Model 3',
                'year': '2023',
                'vin': f'5YJ3E1EA{random.randint(100000, 999999)}'
            },
            {
                'make': 'BMW',
                'model': 'X5',
                'year': '2022',
                'vin': f'5UXCR6C{random.randint(1000000, 9999999)}'
            }
        ]

        for vehicle_data in vehicles:
            Vehicle.objects.create(**vehicle_data)
            self.stdout.write(f'Created vehicle: {vehicle_data["make"]} {vehicle_data["model"]}') 