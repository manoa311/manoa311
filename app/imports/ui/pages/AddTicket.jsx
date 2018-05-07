import React from 'react';
import { Tickets, TicketSchema } from '/imports/api/ticket/ticket';
import { Grid, Segment, Header } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';

/** Renders the Page for adding a document. */
class AddTicket extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.insertCallback = this.insertCallback.bind(this);
    this.currDate = new Date();
    this.formRef = null;
  }

  /** Notify the user of the results of the submit. If successful, clear the form. */
  insertCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Add failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Add succeeded' });
      this.formRef.reset();
    }
  }

  /** On submit, insert the data. */
  submit(data) {
    const { building, floor, room, description, priority, votes, status, createdOn } = data;
    const owner = Meteor.user().username;
    const updatedOn = this.currDate;

    Tickets.insert({ building, floor, room, description, priority, votes, status, createdOn, updatedOn, owner }, this.insertCallback);
  }

  /** TODO: Add image field */

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center" inverted>Add Ticket</Header>
            <AutoForm ref={(ref) => { this.formRef = ref; }} schema={TicketSchema} onSubmit={this.submit}>
              <Segment>
                <TextField name='building'/>
                <TextField name='floor'/>
                <TextField name='room'/>
                <LongTextField name='description'/>
                <TextField name='priority'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
                <HiddenField name='owner' value='fakeuser@foo.com'/>
                <HiddenField name='votes' value='0'/>
                <HiddenField name='status' value="New"/>
                <HiddenField name='createdOn' value={this.currDate}/>
                <HiddenField name='updatedOn' value='2018-01-01T00:00:00Z'/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default AddTicket;
