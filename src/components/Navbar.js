import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Material-ui
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

// Redux
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/userActions";

class Navbar extends Component {
  render() {
    const {
      authenticated,
      status,
      cca: { name },
    } = this.props;

    const handleLogout = () => {
      this.props.logoutUser();
    };

    return (
      <AppBar >
        <Toolbar className="nav-container">
          {authenticated ? (
            <Fragment>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              {status === "User " ? (
                <Button color="inherit" component={Link} to="/admin">
                  Admin
                </Button>
              ) : (
                <Fragment>
                  <Button color="inherit" component={Link} to="/cca">
                    {name === "" ? "CCA" : name}
                  </Button>
                  <Button color="inherit" component={Link} to="/new_event">
                    New Event
                  </Button>
                </Fragment>
              )}
              <Button color="inherit" component={Link} to="/join">
                Join
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  authenticated: state.user.authenticated,
  status: state.user.adminStatus.tokenHeader,
  cca: state.cca,
});

const mapActionsToProps = { logoutUser };

export default connect(mapStateToProps, mapActionsToProps)(Navbar);
