import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

const bgColors = {
  "Urgent": "#E9573F",
  "Regular": "#F6BB42",
};


/** Renders a single row in the List Contacts Admin table. See pages/ListContacts.jsx. */
class Ticket extends React.Component {
  render() {
    const assignRowBackgroundColor = (priorityLevel) => {
      return bgColors[priorityLevel];
    };

    const tableStyle = { fontFamily: 'Trebuchet MS', backgroundColor: assignRowBackgroundColor(this.props.ticket.priority) };

    return (
        <Table.Row style={tableStyle}>
          <Link to={`/view/${this.props.ticket._id}`}><Table.Cell>{this.props.ticket.building}</Table.Cell></Link>
          <Table.Cell>{this.props.ticket.floor}</Table.Cell>
          <Table.Cell>{this.props.ticket.room}</Table.Cell>
          <Table.Cell>{this.props.ticket.priority}</Table.Cell>
          <Table.Cell>{this.props.ticket.description}</Table.Cell>
          <Table.Cell>{this.props.ticket.status}</Table.Cell>
          <Table.Cell>{this.props.ticket.createdOn.toLocaleDateString('en-US')}</Table.Cell>
          <Table.Cell>{this.props.ticket.updatedOn.toLocaleDateString('en-US')}</Table.Cell>
        </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
Ticket.propTypes = {
  ticket: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Ticket);
