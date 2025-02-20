import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [vehicles, setVehicles] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        axios.get('/dashboard/')
            .then(response => {
                setVehicles(response.data.vehicles);
                setServices(response.data.service_history);
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>My Vehicles</h1>
            {vehicles.map(vehicle => (
                <div key={vehicle.id}>
                    <h2>{vehicle.make} {vehicle.model} ({vehicle.year})</h2>
                    <p>VIN: {vehicle.vin}</p>
                </div>
            ))}

            <h1>Service History</h1>
            {services.map(service => (
                <div key={service.id}>
                    <p>{service.service_type} on {service.service_date} - ${service.cost}</p>
                    <p>{service.notes}</p>
                </div>
            ))}
        </div>
    );
};

export default Dashboard;