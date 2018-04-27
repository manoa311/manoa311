import React from 'react';
import { Button, Dropdown, Menu, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Tickets } from '/imports/api/ticket/ticket';
import moment from 'moment';


const bgColors = {
  Urgent: '#E9573F',
  Emergency: '#0cff89',
  Normal: '#F6BB42',
};

const updateOptions = [
  { key: 0, value: 'ticketStatusDone', text: 'Job Done' },
  { key: 1, value: 'ticketStatusCancelled', text: 'Cancel Ticket' },
];


/** Renders a single row in the List Tickets Admin table. See pages/ListTicketsAdmin.jsx. */
class TicketAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeDropDown = this.handleChangeDropDown.bind(this);
    this.onClick = this.onClick.bind(this);
    // this.ticketStatusCancelled = this.ticketStatusCancelled.bind(this);
    // this.ticketStatusDone = this.ticketStatusDone.bind(this);

    this.state = {
      update_status: '',
    };
  }


  /** Notify the user of the results of the submit. If successful, clear the form. */
  cancelCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Cancel Update Status Failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Cancel Update Status Succeeded' });
    }
  }

  /** Notify the user of the results of the submit. If successful, clear the form. */
  deleteCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Delete Failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Delete Succeeded' });
    }
  }

  handleChangeDropDown = (e, { name, value }) => {
    // this.setState({ [name]: value });
    // const updateAction = () => this.value;
    // return updateAction;
    // Tickets.update(this.props.ticket._id, { $set: { status: 'Cancelled' } }, this.cancelCallback);
    // Tickets.update(this.props.ticket._id, { $set: { updatedOn: moment().toDate() } });
    switch (value) {
      case 'ticketStatusCancelled':
        Tickets.update(this.props.ticket._id, { $set: { status: 'Cancelled' } }, this.cancelCallback);
        Tickets.update(this.props.ticket._id, { $set: { updatedOn: moment().toDate() } });
        break;
      case 'ticketStatusDone':
        Tickets.update(this.props.ticket._id, { $set: { status: 'Resolved' } });
        Tickets.update(this.props.ticket._id, { $set: { updatedOn: moment().toDate() } });
        break;
      default:
        Bert.alert({ type: 'danger', message: `Not A Valid Option!` });
    }

  }

  /** On submit, insert the data. */
  onClick() {
    /* eslint-disable-next-line */
    if (confirm('Are Really Really Sure You Want To Delete This Ticket???')) {
      Tickets.remove(this.props.ticket._id, this.deleteCallback);
    }
  }

  // ticketStatusCancelled() {
  //   Tickets.update(this.props.ticket._id, { $set: { status: 'Cancelled' } }, this.cancelCallback);
  //   Tickets.update(this.props.ticket._id, { $set: { updatedOn: moment().toDate() } });
  // }
  //
  // ticketStatusDone() {
  //   Tickets.update(this.props.ticket._id, { $set: { status: 'Done' } });
  //   Tickets.update(this.props.ticket._id, { $set: { updatedOn: moment().toDate() } });
  // }

  updatedOnStatus = () => {
    if (this.props.ticket.createdOn.getTime() === this.props.ticket.updatedOn.getTime()) {
      return 'No Update';
    }
      return this.props.ticket.updatedOn.toLocaleDateString('en-US');
  };

  assignRowBackgroundColor= (priorityLevel) => bgColors[priorityLevel];

  render() {
    return (
        <Table.Row style={{ backgroundColor: this.assignRowBackgroundColor(this.props.ticket.priority) }}>
          <Table.Cell>{this.props.ticket.priority}</Table.Cell>
          <Table.Cell>{this.props.ticket.status}</Table.Cell>
          <Table.Cell>{this.props.ticket.building}</Table.Cell>
          <Table.Cell>{this.props.ticket.floor}</Table.Cell>
          <Table.Cell>{this.props.ticket.room}</Table.Cell>
          <Table.Cell>{this.props.ticket.description}</Table.Cell>
          <Table.Cell>{this.props.ticket.votes}</Table.Cell>
          <Table.Cell>{this.props.ticket.createdOn.toLocaleDateString('en-US')}</Table.Cell>
          <Table.Cell>{this.updatedOnStatus()}</Table.Cell>
          <Table.Cell>
            <Menu>
              <Menu.Item>
                <Dropdown
                    button
                    name = 'update_status'
                    type = 'text'
                    placeholder = 'Update Staus'
                    options = {updateOptions}
                    // value = {this.state.update_status}
                    onChange = {this.handleChangeDropDown}
                />
              </Menu.Item>
            </Menu>
          </Table.Cell>
          <Table.Cell>
            <Button onClick={this.onClick}>
              Delete
            </Button>
          </Table.Cell>
        </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
TicketAdmin.propTypes = {
  ticket: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(TicketAdmin);
