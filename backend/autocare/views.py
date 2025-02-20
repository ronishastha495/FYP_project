from django.shortcuts import render
from django.http import JsonResponse
from .models import Vehicle, ServiceHistory, Booking, Reminder
from django.contrib.auth.decorators import login_required


# Create your views here.
# User Dashboard
@login_required
def dashboard(request):
    vehicles = Vehicle.objects.filter(user=request.user)
    service_history = ServiceHistory.objects.filter(vehicle__user=request.user)
    return render(request, 'dashboard.html', {
        'vehicles': vehicles,
        'service_history': service_history,
    })

# Search Services
@login_required
def search_services(request):
    query = request.GET.get('query', '')
    services = ServiceHistory.objects.filter(service_type__icontains=query)
    results = [{'service_type': s.service_type, 'cost': s.cost} for s in services]
    return JsonResponse(results, safe=False)

# Add Booking
@login_required
def add_booking(request):
    if request.method == 'POST':
        vehicle_id = request.POST.get('vehicle_id')
        service = request.POST.get('service')
        date = request.POST.get('date')
        time = request.POST.get('time')
        vehicle = Vehicle.objects.get(id=vehicle_id)
        booking = Booking(user=request.user, vehicle=vehicle, service=service, date=date, time=time)
        booking.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)