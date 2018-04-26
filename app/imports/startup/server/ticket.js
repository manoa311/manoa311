import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Tickets } from '../../api/ticket/ticket.js';

/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: ${data.building} (${data.owner})`);
  Tickets.insert(data);
}

/** Initialize the collection if empty. */
if (Tickets.find().count() === 0) {
  if (Meteor.settings.defaultTickets) {
    console.log('Creating default ticket data.');
    Meteor.settings.defaultTickets.map(data => addData(data));
  }
}

/** This subscription publishes only the documents associated with the logged in user */
Meteor.publish('Tickets', function publish() {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Tickets.find({ owner: username });
  }
  return this.ready();
});

/** This subscription publishes all tickets belonging to the currently logged in user */
Meteor.publish('MyTickets', function publish() {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Tickets.find({ owner: username });
  }
  return this.ready();
});

/** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
Meteor.publish('TicketsAdmin', function publish() {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Tickets.find();
  }
  return this.ready();
});

/** This subscription publishes all Tickets that hve not been , but only if the logged in user is the Admin. */
Meteor.publish('TicketsAdminNew', function publish() {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Tickets.find({ status: 'New' });
  }
  return this.ready();
});

Meteor.publish('TicketsAll', function publish() {
  return Tickets.find();
});
