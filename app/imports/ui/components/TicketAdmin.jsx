import React from 'react';
import { Checkbox, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const bgColors = {
  Urgent: '#E9573F',
  Regular: '#F6BB42',
};


/** Renders a single row in the List Tickets Admin table. See pages/ListTicketsAdmin.jsx. */
class TicketAdmin extends React.Component {
  render() {
    const assignRowBackgroundColor = (priorityLevel) => bgColors[priorityLevel];

    return (
        <Table.Row style={{ backgroundColor: assignRowBackgroundColor(this.props.ticket.priority) }}>
          <Table.Cell collapsing textAlign="center">
            <Checkbox fitted />
          </Table.Cell>
          <Table.Cell>{this.props.ticket.building}</Table.Cell>
          <Table.Cell>{this.props.ticket.floor}</Table.Cell>
          <Table.Cell>{this.props.ticket.room}</Table.Cell>
          <Table.Cell>{this.props.ticket.priority}</Table.Cell>
          <Table.Cell>{this.props.ticket.description}</Table.Cell>
          <Table.Cell>{this.props.ticket.status}</Table.Cell>
          <Table.Cell>{this.props.ticket.votes}</Table.Cell>
          <Table.Cell>{this.props.ticket.createdOn.toLocaleDateString('en-US')}</Table.Cell>
          <Table.Cell>{this.props.ticket.updatedOn.toLocaleDateString('en-US')}</Table.Cell>
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
