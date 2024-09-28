import React, { useEffect, useState } from "react";
import { NavLink as ReactLink } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from "reactstrap";
import { doLogout, fetchCurrentUser, isLoggedIn } from "./loginComponents";
import { Navigate, useNavigate } from "react-router";
import { toast } from "react-toastify";

const CustomNavbar = () => {
  let admin = "Admin";
  let userRole = "user";
  const navigation = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    setLogin(isLoggedIn());
    setUser(fetchCurrentUser());
  }, [login]);

  const logout = () => {
    doLogout(() => {
      setLogin(false);
      navigation("/");
      toast.success("User Logged out.");
    });
  };

  return (
    <div>
      <Navbar color="primary" dark expand="md" fixed="">
        <NavbarBrand tag={ReactLink} to="/">
          <b>MovieBookingApp</b>
        </NavbarBrand>
        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse navbar isOpen={isOpen}>
          {login && user.role == admin ? (
            <>
              <Nav className="me-auto" navbar>
                <NavItem>
                  <NavLink tag={ReactLink} to="/addTheater">
                    <b>Add Theater</b>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={ReactLink} to="/addMovie">
                    <b>Add Movie</b>
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink tag={ReactLink} to="/manageMovies">
                    <b>Manage Movies</b>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={ReactLink} to="/manageTickets">
                    <b>Manage Tickets</b>
                  </NavLink>
                </NavItem>
              </Nav>
            </>
          ) : (
            <></>
          )}

          {login && user.role == userRole ? (
            <Nav className="me-auto" navbar>
              <NavItem>
                <NavLink tag={ReactLink} to="/bookedTickets">
                  <b>Booked Tickets</b>
                </NavLink>
              </NavItem>
            </Nav>
          ) : (
            <></>
          )}

          {login && (
            <>
              <Nav className="ms-auto " navbar>
                <NavItem>
                  <NavLink active>
                    Welcome <b className="p-2"> {user.name}</b>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={ReactLink} onClick={logout}>
                    <b>Logout</b>
                  </NavLink>
                </NavItem>
              </Nav>
            </>
          )}
          {!login && (
            <>
              <Nav className="ms-auto " navbar>
                <NavItem>
                  <NavLink tag={ReactLink} to="/login">
                    <b>Login</b>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={ReactLink} to="/signup">
                    <b>Signup</b>
                  </NavLink>
                </NavItem>
              </Nav>
            </>
          )}
        </Collapse>
      </Navbar>
    </div>
  );
};
export default CustomNavbar;
