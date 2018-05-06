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
  { key: 0, value: 'Resolved', text: 'Job Resolved' },
  { key: 1, value: 'Cancelled', text: 'Cancel Ticket' },
];


/** Renders a single row in the List Tickets Admin table. See pages/ListTicketsAdmin.jsx. */
class TicketAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeDropDown = this.handleChangeDropDown.bind(this);
    this.onClick = this.onClick.bind(this);

    // this.state = {
    //   update_status: '',
    // };
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
  handleChangeDropDownCallback(value, error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Cancel Update Status Failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: `Success! Ticket Status Updated to ${value}` });
    }
  }


  handleChangeDropDown = (e, { value }) => {
    const val = value;
    Tickets.update(this.props.ticket._id, { $set: { status: value } }, this.handleChangeDropDownCallback(val));
    Tickets.update(this.props.ticket._id, { $set: { updatedOn: moment().toDate() } });
  }

  /** On submit, insert the data. */
  onClick() {
    /* eslint-disable-next-line */
    if (confirm('Are Really Really Sure You Want To Delete This Ticket???')) {
      Tickets.remove(this.props.ticket._id, this.deleteCallback);
    }
  }

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
            <Dropdown
                button
                name = 'update_status'
                type = 'text'
                placeholder = 'Update Status'
                options = {updateOptions}
                onChange = {this.handleChangeDropDown}
            />
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
