import React from 'react';
import { Table, Grid, Loader, Header, Segment, Button, Icon, Feed } from 'semantic-ui-react';
import { Tickets, TicketSchema } from '/imports/api/ticket/ticket';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import AddNote from '/imports/ui/components/AddNote';
import Note from '/imports/ui/components/Note';
import { Roles } from 'meteor/alanning:roles';
import { Notes } from '/imports/api/note/note';

/** Renders the Page for editing a single document. */
class ViewTicket extends React.Component {


  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Ticket ####</Header>
            <Table celled fixed>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    Building
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Floor
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Room
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Priority
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Description
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Ticket Status
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Date Created
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Date Updated
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Cell>
                  {this.props.ticket.building}
                </Table.Cell>
                <Table.Cell>
                  {this.props.ticket.floor}
                </Table.Cell>
                <Table.Cell>
                  {this.props.ticket.room}
                </Table.Cell>
                <Table.Cell>
                  {this.props.ticket.priority}
                </Table.Cell>
                <Table.Cell>
                  {this.props.ticket.description}
                </Table.Cell>
                <Table.Cell>
                  {this.props.ticket.status}
                </Table.Cell>
                <Table.Cell>
                  {this.props.ticket.createdOn.toLocaleDateString('en-US')}
                </Table.Cell>
                <Table.Cell>
                  {this.props.ticket.updatedOn.toLocaleDateString('en-US')}
                </Table.Cell>
              </Table.Body>
            </Table>
            <Segment>
              <Table celled fixed>
                Description
                <Table.Row>
                  Some long description of the problem
                </Table.Row>
              </Table>
              <Button><Icon className='thumbs up'/></Button>
              <Button><Icon className='thumbs down'/></Button>
              <Button floated='right'><Icon className='star'/></Button>
              <Button floated='right'><Icon className='exclamation'/></Button>
            </Segment>
            <Segment>
              Comments
              <Feed>
                {this.props.notes.map((note, index) => <Note key={index} note={note.contactId === this.props.ticket._id}/>)}
              </Feed>
            </Segment>
            <Segment>
              <AddNote owner={this.props.ticket.owner} contactId={this.props.ticket._id}/>
            </Segment>
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
                <Segment>
                  <Button>Delete</Button>
                  <Button>Update</Button>
                </Segment>
            ) : ''}
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use. */
ViewTicket.propTypes = {
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
  const subscription = Meteor.subscribe('Tickets');
  return {
    doc: Tickets.findOne(documentId),
    ticket: Tickets.findOne(documentId),
    ready: subscription.ready(),
    notes: Notes.find({}).fetch(),
  };
})(ViewTicket);
