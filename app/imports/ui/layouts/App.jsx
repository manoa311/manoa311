import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import ListContacts from '../pages/ListContacts';
import AddContact from '../pages/AddContact';
import EditContact from '../pages/EditContact';
import ViewTicket from '../pages/ViewTicket';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';
import ListTicketsAdmin from '../pages/ListTicketsAdmin';
import MyTickets from '../pages/MyTickets';
import AddTicket from '../pages/AddTicket';
import AboutUs from '../pages/AboutUs';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.getAdminStatus = this.getAdminStatus.bind(this);
  //   this.state = { isAdminIn: false };
  // }
  //
  // getAdminStatus() {
  //   const isLogged = Meteor.userId() !== null;
  //   const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  //   const statusUpdate = (isLogged && isAdmin);
  //   this.setState({ isAdmin: statusUpdate });
  //   console.log(this.state.isAdminIn);
  // }

  render() {
    return (
        <Router>
          <div>
            <NavBar/>
            <Switch>
              <Route exact path="/" component={Landing}/>
              <Route path="/signin" component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <ProtectedRoute path="/list" component={ListContacts}/>
              <ProtectedRoute path="/add" component={AddTicket}/>
              <ProtectedRoute path="/edit/:_id" component={EditContact}/>
              <ProtectedRoute path="/view/:_id" component={ViewTicket}/>
              <ProtectedRoute path="/about" component={AboutUs}/>
              <AdminProtectedRoute path="/admin-ticket" component={ListTicketsAdmin}/>
              <ProtectedRoute path="/my-tickets" component={MyTickets}/>
              <ProtectedRoute path="/signout" component={Signout}/>
              <Route component={NotFound}/>
            </Switch>
            <Footer/>
          </div>
        </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
          const isLogged = Meteor.userId() !== null;
          return isLogged ?
              (<Component {...props} />) :
              (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
              );
        }}
    />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
          const isLogged = Meteor.userId() !== null;
          const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
          return (isLogged && isAdmin) ?
              <Component {...props} /> :
              <Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>;
        }}
    />
);

/** Require a component and location to be passed to each ProtectedRoute. */
ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

/** Require a component and location to be passed to each AdminProtectedRoute. */
AdminProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

export default App;
