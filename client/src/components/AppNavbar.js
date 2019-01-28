import React, { Component } from 'react';
import { logoutAction, setCurrentUser } from '../actions/authActions';
import { Link, Router } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import { Row, Col } from 'antd';

class AppNavbar extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            isOpen: false,
            currentUser: null
        };
        this.props.setCurrentUser().then((res) => {
            this.setState({
                currentUser: res.payload._id
            });
        });
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    handleLogout() {
        this.props.logoutAction();
        localStorage.removeItem('jwtToken');
        this.setState({
            currentUser: null
        });
    }
    render() {
        return (
            <div>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand tag={Link} href="/" to="/">Plusfolio</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        {this.state.currentUser ? (
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink tag={Link} href="/portfolio" to="/portfolio">
                                        Portfolio
                                            </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} href="/profile" to="/profile">
                                        Profile
                                            </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} onClick={this.handleLogout} href="/" to="/">
                                        Logout
                                            </NavLink>
                                </NavItem>
                            </Nav>
                        ) : (
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <NavLink tag={Link} href="/login" to="/login">
                                            Login
                                            </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={Link} href="/register" to="/register">
                                            Register
                                            </NavLink>
                                    </NavItem>
                                </Nav>
                            )}
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    tickers: state.tickers
});
export default connect(mapStateToProps, { logoutAction, setCurrentUser })(AppNavbar);
