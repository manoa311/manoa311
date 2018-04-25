import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Table } from 'semantic-ui-react';
import { Tickets } from '/imports/api/ticket/ticket';
import Ticket from '/imports/ui/components/Ticket';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';


/** Table template from https://react.semantic-ui.com/collections/table#table-example-sortable */

/** Selectable cells from https://react.semantic-ui.com/collections/table#table-example-selectable-cell */

/** TODO: add dynamic config for cell coloring, fix table sorting, add a hrefs to selectable cells */

/** Cell populating config (place in <Table.Body>)
 *
  getColorProps(status) {
    if (status === "Unresolved") {
      return {warning: true}
    }
    ...
  }
 {_.map(data, ({ status, ticketName, building, room, issuedBy, dateCreated, dateUpdated }) => (
     <Table.Row key={dateCreated}>
       <Table.Cell {...getColorProps(status)}>{status}</Table.Cell>
       <Table.Cell>{ticketName}</Table.Cell>
       <Table.Cell>{building}</Table.Cell>
       <Table.Cell>{room}</Table.Cell>
       <Table.Cell>{issuedBy}</Table.Cell>
       <Table.Cell>{dateCreated}</Table.Cell>
       <Table.Cell>{dateUpdated}</Table.Cell>
     </Table.Row>
 ))}

 * */
class Landing2 extends React.Component {

  render() {

    return (
        <div className='background-landing'>
          <Table sortable celled selectable fixed>
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
              {this.props.tickets.map((ticket, index) => <Ticket key={index} ticket={ticket}/>  )}
            </Table.Body>
          </Table>
        </div>
    );
  }
}

Landing2.propTypes = {
  tickets: PropTypes.array.isRequired,
};

export default withTracker(() => {
  // Get access to Contacts documents.
  const subscription = Meteor.subscribe('Tickets');
  return {
    tickets: Tickets.find({}, { sort: { createdOn: -1 } }).fetch(),
    ready: subscription.ready(),
  };
})(Landing2);
