import React from 'react';
import { Header, List, Loader, Segment } from 'semantic-ui-react';
import { Tickets, TicketSchema } from '/imports/api/ticket/ticket';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Notes } from '/imports/api/note/note';

/** Renders the Page for editing a single document. */
class AboutUs extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    return (
        <Segment.Group raised>
          <Segment><Header as='h1'>Manoa311</Header></Segment>
          <Segment><Header as='h2'>Table of Contents</Header></Segment>
          <Segment><List bulleted>
            <List.Item as='a'>About Manoa311</List.Item>
            <List.Item as='a'>Installation</List.Item>
            <List.Item>
              <a>Application Design</a>
              <List.List>
                <List.Item as='a'>Landing page</List.Item>
                <List.Item as='a'>"My Tickets" page</List.Item>
                <List.Item as='a'>"Admin Tickets" page</List.Item>
                <List.Item as='a'>"Create a Ticket" page</List.Item>
                <List.Item as='a'>"View Ticket" page</List.Item>
              </List.List>
            </List.Item>
            <List.Item>
              <a>Development History</a>
              <List.List>
                <List.Item as='a'>Advanced Features</List.Item>
              </List.List>
            </List.Item>
            <List.Item as='a'>Contact</List.Item>
          </List>
          </Segment>
          <Segment><Header as='h2'>About</Header><p>UH has many problems with broken stuff, especially restrooms. There have been too many times where I’ve entered a restroom with a broken door handle, missing soap, and rancid odors. In addition to restroom issues, there are other facility problems throughout UH.</p>
          </Segment>
          <Segment><Header as='h2' name="Install">Installation</Header>
            <List ordered>
              <List.Item>Clone our repository at https://github.com/manoa311/manoa311</List.Item>
              <List.Item>
                Install the following meteor packages:
                <List.List>
                  <List.Item>Moment.js</List.Item>
                  <List.Item>npm install moment --save - Datepicker</List.Item>
                  <List.Item>npm install react-datepicker --save - TODO</List.Item>
                </List.List>
              </List.Item>
              <List.Item>Start meteor
              <List.List>
                <List.Item>cd ~path to Manoa311/app</List.Item>
                <List.Item>meteor npm run start</List.Item>
              </List.List></List.Item>
            </List></Segment>
          <Segment><Header as='h2'>Application Design</Header>
          <p>Our application aims to try to end that by providing a platform for students and faculty to submit repair tickets for certain areas. Repair tickets include description of the problem, location, and image of the issue. Repair tickets may be “upvoted” for awareness by other users, so that the ticket gains attention from administrators.</p><List bulleted>
              <List.Item>Landing page: Listing of all current tickets with navigation/filter bar (filter by ticket age, location, popularity), with login/sign up on the top right, contact information on the bottom.</List.Item>
              <List.Item>“My Tickets” page: Same as landing page, but with options to create a ticket, view your current tickets, follow a ticket (user will get notified of any updates to issue), view followed tickets, upvote tickets.</List.Item>
              <List.Item>Admin Tickets page: Same as user home page, but with options to view all users, edit tickets, delete tickets, and block users.</List.Item>
              <List.Item>Creating a ticket: when creating a ticket, the user will have to specify 1) what building the issue is in, 2) what type of facility the issue is in (e.g. bathroom, classroom), 3) specifically what the issue is in that room. Users can specify a severity level (on a scale from mild to critical). Users can upvote other tickets for awareness and report/flag to filter “trolls”. A ticket, by default, is unresolved and when seen by administrators, can be updated to received (meaning that the issue is acknowledged). Users can vote a ticket to be resolved, then administrators can mark a ticket as resolved once they verify whether or not the issue is actually fixed (upload a picture of the resolved issue?).</List.Item>
              <List.Item>Viewing a ticket: when viewing a ticket, the user can comment on the ticket. @Administrators can add a projected finish date to a ticket after receiving it, which lets users know when they plan to work on fixing the issue.</List.Item>
            </List></Segment>
          <Segment><Header as='h2'>Contact Us</Header>
            <List bulleted>
              <List.Item>Joaquin Torres (jftorres@hawaii.edu)</List.Item>
              <List.Item>Nolan Puletasi (pn7@hawaii.edu)</List.Item>
              <List.Item>Michael Kurihara (mkurihar@hawaii.edu)</List.Item>
              <List.Item>Jason Maligon (jmaligon@hawaii.edu)</List.Item>
            </List></Segment>
        </Segment.Group>
    );
  }
}

/** Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use. */
AboutUs.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
  ticket: PropTypes.object.isRequired,
  notes: PropTypes.array.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Contacts documents.
  const subscription = Meteor.subscribe('TicketsAll');
  const subscription2 = Meteor.subscribe('NotesAll');
  return {
    doc: Tickets.findOne(documentId),
    ticket: Tickets.findOne(documentId),
    ready: (subscription.ready() && subscription2.ready()),
    notes: Notes.find({ contactId: documentId }).fetch(),
  };
})(AboutUs);
