import { Heading1, Text, Button } from "react"
import { Routes } from "react-router-dom"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_appointments, logout } from "../endpoints/api"; 

const Menu = () => {
    const [appointments, setAppointments] = useState([])
    const nav = useNavigate();

    useEffect(() => {
        const fetchAppointments= async () => {
            const appointments = await get_appointments()
            setAppointments(appointments)
        }
        fetchAppointments();
    
    }, [])

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            nav('/login')

        }
    }

    return
    <Routes>
        <Heading1>Welcome back user </Heading1>
        <Routes>
            {appointments.map((appointment) => {
                return <Text> {appointment.description}</Text>
            })}
        </Routes>
        <Button onClick={handleLogout} colorScheme="red"> Logout </Button>

</Routes>
}

export default Menu;