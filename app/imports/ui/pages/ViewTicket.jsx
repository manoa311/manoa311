import React from 'react';
import { Table, Grid, Loader, Header, Segment, Button, Icon, Feed, Label, Dropdown } from 'semantic-ui-react';
import { Tickets, TicketSchema } from '/imports/api/ticket/ticket';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import AddNote from '/imports/ui/components/AddNote';
import Note from '/imports/ui/components/Note';
import { Roles } from 'meteor/alanning:roles';
import { Notes } from '/imports/api/note/note';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

const updateOptions = [
  { key: 0, value: 'Resolved', text: 'Job Resolved' },
  { key: 1, value: 'Cancelled', text: 'Cancel Ticket' },
];

/** Renders the Page for editing a single document. */
class ViewTicket extends React.Component {

  constructor(props) {
    super(props)
    this.state ={
      logCount: this.props.ticket.votes,
      voted: false,
      redirect: false,
      status: false,
    };
    this.handleUp = this.handleUp.bind(this);
    this.deleteTicket = this.deleteTicket.bind(this);
    this.handleChangeDropDown = this.handleChangeDropDown.bind(this);
  }

  handleUp = () => {
    if (!this.state.voted) {
      this.setState((prevState) => {
        return {
          logCount: prevState.logCount + 1,
          voted: true,
        }
      })
      Tickets.update(this.props.ticket._id, { $set: {votes: this.props.ticket.votes + 1} });
    }
  };

  handleDown = () => {
    if (!this.state.voted) {
      this.setState((prevState) => {
        return {
          logCount: prevState.logCount - 1,
          voted: true,
        }
      })
      Tickets.update(this.props.ticket._id, { $set: {votes: this.props.ticket.votes - 1} });
    }
  };

  handleChangeDropDown = (e, { value }) => {
    const val = value;
    Tickets.update(this.props.ticket._id, { $set: { status: value } }, this.handleChangeDropDownCallback(val));
    Tickets.update(this.props.ticket._id, { $set: { updatedOn: moment().toDate() } });
  }

  handleChangeDropDownCallback(value, error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Cancel Update Status Failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: `Success! Ticket Status Updated to ${value}` });
    }
  }

  updatedOnStatus = () => {
    if (this.props.ticket.createdOn.getTime() === this.props.ticket.updatedOn.getTime()) {
      return 'No Update';
    }
    return this.props.ticket.updatedOn.toLocaleDateString('en-US');
  };

  deleteTicket() {
    if (confirm('Are Really Really Sure You Want To Delete This Ticket???')) {
      Tickets.remove(this.props.ticket._id);
      this.setState({ redirect: true });
    }
  }

  updatedOnStatus = () => {
    if (this.props.ticket.createdOn.getTime() === this.props.ticket.updatedOn.getTime()) {
      return 'No Update';
    }
    return this.props.ticket.updatedOn.toLocaleDateString('en-US');
  };

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {

    const { redirect } = this.state;
    const { logCount } = this.state;

    return (

        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center" inverted>Ticket</Header>
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
                  <p/>
                  {this.props.ticket.createdOn.toLocaleTimeString('en-US')}
                </Table.Cell>
                <Table.Cell>
                  {this.props.ticket.updatedOn.toLocaleDateString('en-US')}
                  <p/>
                  {this.props.ticket.updatedOn.toLocaleTimeString('en-US')}
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
              <Button onClick={this.handleUp}><Icon className='angle up'/></Button>
              <Button onClick={this.handleDown}><Icon className='angle down'/></Button>
              <Label circular>{logCount}</Label>
            </Segment>
            <Segment>
              Comments
              <Feed>
                {this.props.notes.map((note, index) => <Note key={index} note={note}/>)}
              </Feed>
            </Segment>
            <Segment>
              <AddNote owner={this.props.ticket.owner} contactId={this.props.ticket._id}/>
            </Segment>
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
                <Segment>
                  <Button onClick={this.deleteTicket}>
                    Delete
                  </Button>
                  <Dropdown
                      button
                      name = 'update_status'
                      type = 'text'Z
                      placeholder = 'Update Status'
                      options = {updateOptions}
                      onChange = {this.handleChangeDropDown}
                  />
                  {redirect && (<Redirect to={'/'}/>)}
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
    notes: Notes.find({contactId: documentId}).fetch(),
  };
})(ViewTicket);
