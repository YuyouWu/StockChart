import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container } from 'reactstrap';

class AppNavbar extends Component{
    constructor(props){
        super(props);
        
        this.toggle = this.toggle.bind(this);
        this.state = {
          isOpen: false
        };        
    }
    toggle() {
        this.setState({
          isOpen: !this.state.isOpen
        });
    }
    render() {
        return (
          <div>
            <Navbar color="dark" dark expand="md">
                <Container>
                    <NavbarBrand href="/">Portfolio</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/portfolio">
                                    Portfolio
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/register">
                                    Register
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
          </div>
        );
    }    
}

export default AppNavbar;