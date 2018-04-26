import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Tickets } from '/imports/api/ticket/ticket';


const bgColors = {
  Urgent: '#E9573F',
  Regular: '#F6BB42',
};


/** Renders a single row in the List Tickets Admin table. See pages/ListTicketsAdmin.jsx. */
class TicketAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  /** Notify the user of the results of the submit. If successful, clear the form. */
  deleteCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Delete failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Delete succeeded' });
    }
  }

  /** On submit, insert the data. */
  onClick() {
    /* eslint-disable-next-line */
    if (confirm('Are Really Really Sure You Want To Delete This Ticket???')) {
      Tickets.remove(this.props.ticket._id, this.deleteCallback);
    }
  }

  render() {
    const assignRowBackgroundColor = (priorityLevel) => bgColors[priorityLevel];

    return (
        <Table.Row style={{ backgroundColor: assignRowBackgroundColor(this.props.ticket.priority) }}>
          <Table.Cell>{this.props.ticket.building}</Table.Cell>
          <Table.Cell>{this.props.ticket.floor}</Table.Cell>
          <Table.Cell>{this.props.ticket.room}</Table.Cell>
          <Table.Cell>{this.props.ticket.priority}</Table.Cell>
          <Table.Cell>{this.props.ticket.description}</Table.Cell>
          <Table.Cell>{this.props.ticket.status}</Table.Cell>
          <Table.Cell>{this.props.ticket.votes}</Table.Cell>
          <Table.Cell>{this.props.ticket.createdOn.toLocaleDateString('en-US')}</Table.Cell>
          <Table.Cell>{this.props.ticket.updatedOn.toLocaleDateString('en-US')}</Table.Cell>
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
