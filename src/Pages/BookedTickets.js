import React, { useEffect, useState } from "react";
import { Card, CardBody, ListGroupItem, ListGroup, Row, Col } from "reactstrap";
import Base from "../components/Base";
import { fetchTickets } from "../services/user-service";
import { fetchCurrentUser } from "../components/loginComponents";
import { toast } from "react-toastify";

const BookedTickets = () => {
  const [user, setUser] = useState({ token: "",loginId:"" });
  const [allTickets, setAllTickets] = useState([]);

  useEffect(() => {
    const currentUser = fetchCurrentUser();
    setUser(currentUser);

    if (currentUser.loginId) {
      fetchUserTickets(currentUser.loginId);
    }
  }, []);

  const fetchUserTickets = (loginId) => {
    fetchTickets(loginId)
      .then((resp) => {
        setAllTickets(resp);
      })
      .catch((error) => {
        const errorMsg =
          error.response?.data?.errorMsg || "Failed to fetch tickets";
        toast.warning(errorMsg);
        console.error("Error fetching booked tickets:", errorMsg);
      });
  };

  return (
    <Base>
      {allTickets.length > 0 ? (
        allTickets.map((ticket) => (
          <div className="container-fluid" key={ticket.ticketId}>
            <Row>
              <Col md={{ size: 8, offset: 1 }}>
                <Card className="border-1 shadow-sm mt-3">
                  <CardBody className="card-content">
                    <h3>{ticket.name}</h3>
                    <ListGroup flush>
                      <ListGroupItem>
                        Movie Name: {ticket.movieName}
                      </ListGroupItem>
                      <ListGroupItem>
                        Theater Name: {ticket.theaterName}
                      </ListGroupItem>
                      <ListGroupItem>
                        Theater Location: {ticket.theaterLoc}
                      </ListGroupItem>
                      <ListGroupItem>
                        Booking Date : {ticket.bookingDate}
                      </ListGroupItem>
                      <ListGroupItem>
                        Total Tickets : {ticket.seatNumber.length}
                      </ListGroupItem>
                      <ListGroupItem>
                        Booked Seats: {ticket.seatNumber.join(", ")}
                      </ListGroupItem>
                    </ListGroup>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        ))
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

export default BookedTickets;
