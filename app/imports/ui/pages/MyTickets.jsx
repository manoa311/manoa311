import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Header, Icon, Input, Loader, Menu, Table } from 'semantic-ui-react';
import { Tickets } from '/imports/api/ticket/ticket';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import TicketAdmin from '/imports/ui/components/TicketAdmin';

/** Renders a table containing all of the Tickets documents. Use <TicketAdmin> to render each row. */
class ListTickets extends React.Component {
  constructor() {
    super();

    this.handleClickBuilding = this.handleClickBuilding.bind(this);
    this.handleClickRoom = this.handleClickRoom.bind(this);
    this.handleClickPriority = this.handleClickPriority.bind(this);
    this.handleClickStatus = this.handleClickStatus.bind(this);
    this.handleClickCreated = this.handleClickCreated.bind(this);
    this.handleClickUpdated = this.handleClickUpdated.bind(this);

    this.state = {
      b_building: false,
      b_room: false,
      b_priority: false,
      b_status: false,
      b_created: false,
      b_updated: false,
    };
  }

  handleClickBuilding = () => this.setState({ b_building: !this.state.b_building });
  handleClickRoom = () => this.setState({ b_room: !this.state.b_room });
  handleClickPriority = () => this.setState({ b_priority: !this.state.b_priority });
  handleClickStatus = () => this.setState({ b_status: !this.state.b_status });
  handleClickCreated = () => this.setState({ b_created: !this.state.b_created });
  handleClickUpdated = () => this.setState({ b_updated: !this.state.b_updated });

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const b_building = this.state.b_building;
    const b_room = this.state.b_room;
    const b_priority = this.state.b_priority;
    const b_status = this.state.b_status;
    const b_created = this.state.b_created;
    const b_updated = this.state.b_updated;

    return (
        <Container>
          <Header as="h2" textAlign="center" inverted>List of My Tickets</Header>
          <Menu>
            <Menu.Item>
              <Input icon='search' placeholder='Search tickets...' />
            </Menu.Item>
          </Menu>
          <Table compact striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Select</Table.HeaderCell>
                <Table.HeaderCell>
                  Building
                  <Button compact size='mini' toggle active={b_building} onClick={this.handleClickBuilding}>
                    <Icon name='sort content descending'/>
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Floor
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Room
                  <Button compact size='mini' toggle active={b_room} onClick={this.handleClickRoom}>
                    <Icon name='sort content descending'/>
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Priority
                  <Button compact size='mini' toggle active={b_priority} onClick={this.handleClickPriority}>
                    <Icon name='sort content descending'/>
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Description
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Ticket Status
                  <Button compact size='mini' toggle active={b_status} onClick={this.handleClickStatus}>
                    <Icon name='sort content descending'/>
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Date Created
                  <Button compact size='mini' toggle active={b_created} onClick={this.handleClickCreated}>
                    <Icon name='sort content descending'/>
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Date Updated
                  <Button compact size='mini' toggle active={b_updated} onClick={this.handleClickUpdated}>
                    <Icon name='sort content descending'/>
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.tickets.map((ticket, index) => <TicketAdmin key={index} ticket={ticket} />)}
            </Table.Body>
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan='50%'>
                  <Button size='medium'>Reviewed</Button>
                  <Button size='medium'>Forwarded</Button>
                  <Button size='medium'>Repaired</Button>
                  <Button size='medium'>Delete</Button>
                </Table.HeaderCell>
                <Table.HeaderCell colSpan='50%'>
                  <Menu floated='right' pagination>
                    <Menu.Item as='a' icon>
                      <Icon name='chevron left' />
                    </Menu.Item>
                    <Menu.Item as='a'>1</Menu.Item>
                    <Menu.Item as='a'>2</Menu.Item>
                    <Menu.Item as='a'>3</Menu.Item>
                    <Menu.Item as='a'>4</Menu.Item>
                    <Menu.Item as='a' icon>
                      <Icon name='chevron right' />
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Container>
    );
  }
}

/** Require an array of Tickets documents in the props. */
ListTickets.propTypes = {
  tickets: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Tickets documents.
  const subscription = Meteor.subscribe('MyTickets');
  return {
    tickets: Tickets.find({}, { sort: { createdOn: -1 } }).fetch(),
    ready: subscription.ready(),
  };
})(ListTickets);
