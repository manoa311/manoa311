import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Create a Meteor collection. */
const Tickets = new Mongo.Collection('Tickets');

/** Create a schema to constrain the structure of documents associated with this collection. */
const TicketSchema = new SimpleSchema({
  building: String,
  floor: String,
  room: String,
  description: String,
  longdescription: String,
  priority: String,
  votes: Number,
  status: String,
  createdOn: Date,
  updatedOn: Date,
  owner: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Tickets.attachSchema(TicketSchema);

/** Make the collection and schema available to other code. */
export { Tickets, TicketSchema };
