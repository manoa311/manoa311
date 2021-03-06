import React from 'react';
import { Table, Button, Label, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Tickets, TicketSchema } from '/imports/api/ticket/ticket';

const bgColors = {
  "Emergency": "#E9573F",
  "Urgent": "#F6BB42",
};


/** Renders a single row in the List Contacts Admin table. See pages/ListContacts.jsx. */
class Ticket extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      logCount: this.props.ticket.votes,
      voted: false,
    };
    this.handleUp = this.handleUp.bind(this);
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

  render() {
    const assignRowBackgroundColor = (priorityLevel) => {
      return bgColors[priorityLevel];
    };

    const tableStyle = { fontFamily: 'Trebuchet MS', backgroundColor: assignRowBackgroundColor(this.props.ticket.priority) };

    const { logCount } = this.state;
    const { data } = this.props;
    return (
        <Table.Row style={tableStyle}>
          <Table.Cell collapsing selectable><Button.Group basic><Button onClick={this.handleUp} icon><Icon name = 'angle up' /> </Button>
            <Button onClick={this.handleDown} icon><Icon name = 'angle down' /></Button> </Button.Group><Label circular>{logCount}</Label> </Table.Cell>
          <Table.Cell>{this.props.ticket.priority}</Table.Cell>
          <Table.Cell>{this.props.ticket.status}</Table.Cell>
          <Table.Cell><Link to={`/view/${this.props.ticket._id}`}>{this.props.ticket.description}</Link></Table.Cell>
          <Table.Cell>{this.props.ticket.building}</Table.Cell>
          <Table.Cell>{this.props.ticket.floor}</Table.Cell>
          <Table.Cell>{this.props.ticket.room}</Table.Cell>
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
