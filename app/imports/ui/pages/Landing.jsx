import _ from 'lodash'
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Table, Dropdown, Menu, Form, Button, Icon, Header, List, Loader } from 'semantic-ui-react';
import { Tickets } from '/imports/api/ticket/ticket';
import { withTracker } from 'meteor/react-meteor-data';
/** import { Link } from 'react-router-dom'; */
import TicketAdmin from '/imports/ui/components/TicketAdmin';
import Ticket from '/imports/ui/components/Ticket';
import DatePicker from 'react-datepicker';
import moment from 'moment/moment';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';


/** Table template from https://react.semantic-ui.com/collections/table#table-example-sortable */

/** Selectable cells from https://react.semantic-ui.com/collections/table#table-example-selectable-cell */
/**
const sampleData = [
  { status: 'Unresolved', ticketName: 'Broken door handle', building: 'POST', room: '1st floor Mens bathroom', issuedBy: 'John (john@hawaii.edu)', dateCreated: '2018-02-07 12:05', dateUpdated: 'No Update' },
  { status: 'Resolved', ticketName: 'Broken window', building: 'Saunders Hall', room: 'Room 621E', issuedBy: 'Jack (jack@hawaii.edu)', dateCreated: '2018-03-15 16:05', dateUpdated: '2018-04-08 11:02' },
  { status: 'Resolved', ticketName: 'Missing trashcan', building: 'Hamilton Library', room: '3rd floor Womens bathroom', issuedBy: 'Martha (martha@hawaii.edu)', dateCreated: '2017-08-09 8:05', dateUpdated: '2017-09-03 12:05' },
  { status: 'Received', ticketName: 'Flickering lightbulb', building: 'Keller Hall', room: 'Room 303', issuedBy: 'Wendy (wendy@hawaii.edu)', dateCreated: '2018-01-22 12:38', dateUpdated: '2018-03-21' }
]
*/
const dbDataFields = [
  { key: 'status', value: 'status', text: 'status' },
  { key: 'description', value: 'description', text: 'description' },
  { key: 'building', value: 'building', text: 'Building' },
  { key: 'room', value: 'room', text: 'room' },
  { key: 'floor', value: 'floor', text: 'floor' },
  { key: 'owner', value: 'owner', text: 'owner' },
  { key: 'priority', value: 'priority', text: 'priority' },
  { key: 'votes', value: 'votes', text: 'votes' },
];

const dbDateFields = [
  { key: 'createdOn', value: 'createdOn', text: 'createdOn' },
  { key: 'updatedOn', value: 'updatedOn', text: 'updatedOn' },
];

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
class Landing extends React.Component {

  constructor() {
    super();

    this.addFilter = this.addFilter.bind(this);
    this.addFilterInclusive = this.addFilterInclusive.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.clearFilterInclusive = this.clearFilterInclusive.bind(this);
    this.getFilterInput = this.getFilterInput.bind(this);
    this.getFilterInputInclusive = this.getFilterInputInclusive.bind(this);
    this.getSearchInput = this.getSearchInput.bind(this);
    this.handleChangeDataSearchField = this.handleChangeDataSearchField.bind(this);
    this.handleChangeDateSearchField = this.handleChangeDateSearchField.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.handleClickBuilding = this.handleClickBuilding.bind(this);
    this.handleClickRoom = this.handleClickRoom.bind(this);
    this.handleClickPriority = this.handleClickPriority.bind(this);
    this.handleClickStatus = this.handleClickStatus.bind(this);
    this.handleClickCreated = this.handleClickCreated.bind(this);
    this.handleClickUpdated = this.handleClickUpdated.bind(this);
    this.has = this.has.bind(this);
    this.filtering = this.filtering.bind(this);
    // this.componentDidMount = this.componentDidMount.bind(this);


    this.state = {
      b_building: false,
      b_room: false,
      b_priority: false,
      b_status: false,
      b_created: false,
      b_updated: false,
      data: [],
      search: '',
      search_field: 'building',
      search_date_field: 'createdOn',
      date_start: moment(),
      date_end: moment(),
      search_time: false,
      filter_building: [this.has('Webster'), this.has('Sakamaki'), this.has('Critical')],
      filter_priority: [this.has('Regular')],
      filters: [],
      filters_inclusive: [],
      time_filter_active: false,
      temp_filter: [],
      temp_filter_inclusive: [],
    };
  }

  addFilter() {
    const currArr = this.state.filters;
    const newArr = currArr.concat(this.state.temp_filter);
    this.setState({ filters: newArr });
    this.setState({ temp_filter_array: _.map(newArr, this.has) });
    this.setState({ temp_filter: '' });
  }
  addFilterInclusive() {
    const currArr = this.state.filters_inclusive;
    const newArr = currArr.concat(this.state.temp_filter_inclusive);
    this.setState({ filters_inclusive: newArr });
    this.setState({ temp_filter_array_inclusive: _.map(newArr, this.has) });
    this.setState({ temp_filter_inclusive: '' });
  }

  clearFilter = () => this.setState({ filters: [] });
  clearFilterInclusive = () => this.setState({ filters_inclusive: [] });

  getFilterInput = (event) => this.setState({ temp_filter: event.target.value.substr(0, 20) });
  getFilterInputInclusive = (event) => this.setState({ temp_filter_inclusive: event.target.value.substr(0, 20) });

  getSearchInput = (event) => this.setState({ search: event.target.value.substr(0, 20) });

  handleChangeDataSearchField = (e, { name, value }) => this.setState({ [name]: value });

  handleChangeDateSearchField = (e, { name, value }) => this.setState({ [name]: value });

  handleChangeStart = (date) => this.setState({ date_start: date });
  handleChangeEnd = (date) => this.setState({ date_end: date });

  handleClickBuilding = () => this.setState({ b_building: !this.state.b_building });
  handleClickRoom = () => this.setState({ b_room: !this.state.b_room });
  handleClickPriority = () => this.setState({ b_priority: !this.state.b_priority });
  handleClickStatus = () => this.setState({ b_status: !this.state.b_status });
  handleClickCreated = () => this.setState({ b_created: !this.state.b_created });
  handleClickUpdated = () => this.setState({ b_updated: !this.state.b_updated });

  has = (criteria) => function (value) { return _.contains(value, criteria); }

  filtering = (orgArr, coll) => {
    if (orgArr.length > 0) {
      const hasArr = this.state.temp_filter_array;
      return _.filter(coll, function (t) {
        return _.every(hasArr, function (currentFunction) {
          return currentFunction(t);
        });
      });
    }
    return coll;
  };

  filteringInclusive = (orgArr) => {
    if (orgArr.length > 0) {
      const hasArr = this.state.temp_filter_array_inclusive;
      return _.filter(this.props.tickets, function (t) {
        return _.some(hasArr, function (currentFunction) {
          return currentFunction(t);
        });
      });
    }
    return this.props.tickets;
  };

  /**
  state = {
    column: null,
    data: sampleData,
    direction: null,
  }


  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      })

      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
  }
   */

  lastMonth() {
    this.setState({ date_end: moment().subtract(31, 'days') });
    this.setState({ time_filter_active: true });
  }

  lastWeek() {
    this.setState({ date_end: moment().subtract(7, 'days') });
    this.setState({ time_filter_active: true });
  }

  timeFilterOff = () => this.setState({ time_filter_active: false });

  timeFilter(coll) {
    const filterOn = this.state.time_filter_active;

    if (filterOn) {
      const field_to_query = this.state.search_date_field;
      const end_date = this.state.date_end;
      return coll.filter((t) => moment(t[field_to_query]).isAfter(end_date));
    }
    return coll;
  }

  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  renderPage() {
    const b_building = this.state.b_building;
    const b_room = this.state.b_room;
    const b_priority = this.state.b_priority;
    const b_status = this.state.b_status;
    const b_created = this.state.b_created;
    const b_updated = this.state.b_updated;
    const f_list = this.state.filters;
    const f_list_inclusive = this.state.filters_inclusive;

    const collFilteredInclusive = this.filteringInclusive(f_list_inclusive);
    const collFiltered = this.filtering(f_list, collFilteredInclusive);
    const collSearched = collFiltered.filter((t) => t[this.state.search_field].indexOf(this.state.search) !== -1);

    const collTimeSearchTickets = this.timeFilter(collSearched);

    const menuStyle = { fontFamily: 'Trebuchet MS' };

    return (
        <div className='background-landing'>
          <Menu style={menuStyle} >
            <Dropdown text='Sort By' pointing className='link item'>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Dropdown text='Date Created'>
                    <Dropdown.Menu>
                      <Dropdown.Item>Today</Dropdown.Item>
                      <Dropdown.Item>Yesterday</Dropdown.Item>
                      <Dropdown.Item>This Week</Dropdown.Item>
                      <Dropdown.Item>Last Week</Dropdown.Item>
                      <Dropdown.Item>This Month</Dropdown.Item>
                      <Dropdown.Item>Last Month</Dropdown.Item>
                      <Dropdown.Item>This Year</Dropdown.Item>
                      <Dropdown.Item>Last Year</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown text='Date Updated'>
                    <Dropdown.Menu>
                      <Dropdown.Item>Today</Dropdown.Item>
                      <Dropdown.Item>Yesterday</Dropdown.Item>
                      <Dropdown.Item>This Week</Dropdown.Item>
                      <Dropdown.Item>Last Week</Dropdown.Item>
                      <Dropdown.Item>This Month</Dropdown.Item>
                      <Dropdown.Item>Last Month</Dropdown.Item>
                      <Dropdown.Item>This Year</Dropdown.Item>
                      <Dropdown.Item>Last Year</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item>
              <Dropdown
                  button
                  name = 'search_field'
                  type = 'text'
                  placeholder = 'Search Fields'
                  options = {dbDataFields}
                  value = {this.state.search_field}
                  onChange = {this.handleChangeDataSearchField}
              />
              <Form.Input
                  icon = 'search'
                  placeholder = ''
                  type = 'text'
                  value = {this.state.search}
                  onChange = {this.getSearchInput}
              />
            </Menu.Item>
          </Menu>
          <Table sortable celled selectable fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  Vote
                </Table.HeaderCell>
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
              {collTimeSearchTickets.map((ticket, index) => <Ticket key={index} ticket={ticket} />)}
            </Table.Body>
          </Table>
        </div>
    );
  }
}

/** Require an array of Tickets documents in the props. */
Landing.propTypes = {
  tickets: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Tickets documents.
  const subscription = Meteor.subscribe('TicketsAll');
  return {
    tickets: Tickets.find({}, { sort: { createdOn: -1 } }).fetch(),
    ready: subscription.ready(),
  };
})(Landing);

/** export default Landing; */
