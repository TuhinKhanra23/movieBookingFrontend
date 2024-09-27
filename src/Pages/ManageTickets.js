import React, { useEffect, useState } from "react";
import { Card, CardBody, ListGroupItem, ListGroup, Row, Col } from "reactstrap";
import Base from "../components/Base";
import { fetchAllTickets } from "../services/user-service";
import { fetchCurrentUser } from '../components/loginComponents';
import { toast } from "react-toastify";
import { deleteTicket } from "../services/user-service";



const ManageTickets = () => {
    const [user, setUser] = useState({ token: '' });
    const [allTickets, setAllTickets] = useState([]);

    useEffect(() => {
        const currentUser = fetchCurrentUser();
        setUser(currentUser);

        if (currentUser.token) {
            fetchUserTickets(currentUser.token);
        }
    }, []);

    const fetchUserTickets = () => {
        fetchAllTickets()
            .then((resp) => {
                setAllTickets(resp);
            })
            .catch((error) => {
                toast.warning("Session Expired !! Please Login Again");
                console.error("Error fetching booked tickets:", error);
            });
    };

    const deleteTicketId = (ticketId) => {

        // Implement your delete logic here, e.g., calling an API
        console.log(`Deleting ticket with ID: ${ticketId}`);
        deleteTicket(ticketId,user.token).then((resp)=>{
            toast.success(resp)
            
        }).catch((error)=>{
            console.log(error)
            toast.warning("Session Expired !! Please Login Again")
        });
        // Optionally, refresh the tickets after deletion
    };

    return (
        <Base>
            {allTickets.length > 0 ? (
                allTickets.map((ticket) => {
                    const bookingDate = new Date(ticket.bookingDate);
       
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); 

        const isPastDate = bookingDate < yesterday; 
                    return (
                        <div className="container-fluid" key={ticket.ticketId}>
                            <Row>
                                <Col md={{ size: 8, offset: 1 }}>
                                    <Card style={{
                                        border: '1px solid',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        marginTop: '1rem',
                                        backgroundColor: isPastDate ? '#f8d7da' : '#ffffff'
                                    }}>
                                        <CardBody className="card-content">
                                            <h3>{ticket.name}</h3>
                                            <ListGroup flush>
                                                <ListGroupItem>Movie Name: {ticket.movieName}</ListGroupItem>
                                                <ListGroupItem>Theater Name: {ticket.theaterName}</ListGroupItem>
                                                <ListGroupItem>Theater Location: {ticket.theaterLoc}</ListGroupItem>
                                                <ListGroupItem>Booking Date: {ticket.bookingDate}</ListGroupItem>
                                                <ListGroupItem>Total Tickets: {ticket.seatNumber.length}</ListGroupItem>
                                                <ListGroupItem>Booked Seats: {ticket.seatNumber.join(', ')}</ListGroupItem>
                                            </ListGroup>
                                            
                                                <button
                                                    onClick={() => deleteTicketId(ticket.ticketId)}
                                                    style={{ marginTop: '1rem', backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}
                                                >
                                                    Delete
                                                </button>
                                            
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    );
                })
            ) : (
                <div className="container-fluid mt-5">
                    <Row>
                        <Col md={{ size: 8, offset: 1 }}>
                            <h4>No booked tickets found.</h4>
                        </Col>
                    </Row>
                </div>
            )}

        </Base>
    );
};

export default ManageTickets;
