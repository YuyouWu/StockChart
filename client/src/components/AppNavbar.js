import React, { Component } from 'react';
import { logoutAction, setCurrentUser } from '../actions/authActions';
import { connect } from 'react-redux';
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
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            isOpen: false,
            currentUser: null
        };
        // this.props.setCurrentUser().then((res) =>{
        //     this.setState({
        //       currentUser: res.payload._id
        //     });
        // });
    }
    toggle() {
        this.setState({
          isOpen: !this.state.isOpen
        });
    }
    handleLogout(){
        this.props.logoutAction();
    }
    render() {

        if (this.state.currentUser !== null){

        } else {

        }
        return (
          <div>
            <Navbar color="dark" dark expand="md">
                <Container>
                    <NavbarBrand href="/">InvestmentNow</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/portfolio">
                                    Portfolio
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={this.handleLogout} href="/">
                                    Logout
                                </NavLink>
                            </NavItem>                        
                            <NavItem>
                                <NavLink href="/login">
                                    Login
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

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{logoutAction,setCurrentUser})(AppNavbar);
