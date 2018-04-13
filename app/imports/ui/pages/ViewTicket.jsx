import React from 'react';
import { Table, Grid, Loader, Header, Segment, Button, Icon } from 'semantic-ui-react';
import { Tickets, TicketSchema } from '/imports/api/ticket/ticket';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import AddNote from '/imports/ui/components/AddNote';

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
                    Status
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Ticket Name
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Building
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Room
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Issued By
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
                <Table.Row>
                  <Table.Cell negative selectable>Unresolved</Table.Cell>
                  <Table.Cell>Broken door handle</Table.Cell>
                  <Table.Cell>POST</Table.Cell>
                  <Table.Cell>1st floor Mens bathroom</Table.Cell>
                  <Table.Cell selectable>John (john@hawaii.edu)</Table.Cell>
                  <Table.Cell>2018-02-07 12:05</Table.Cell>
                  <Table.Cell negative>No Update</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Segment>
              <Table celled fixed>
                <Table.Row>Description</Table.Row>
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
              <AddNote/>
            </Segment>
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
  contact: PropTypes.object.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Contacts documents.
  const subscription = Meteor.subscribe('Tickets');
  return {
    doc: Tickets.findOne(documentId),
    ready: subscription.ready(),
  };
})(ViewTicket);
