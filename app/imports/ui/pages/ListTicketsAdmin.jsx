import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Dropdown, Form, Header, Icon, List, Loader, Menu, Table } from 'semantic-ui-react';
import { Tickets } from '/imports/api/ticket/ticket';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import TicketAdmin from '/imports/ui/components/TicketAdmin';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';

const dbDataFields = [
  { key: 'building', value: 'building', text: 'building' },
  { key: 'description', value: 'description', text: 'description' },
  { key: 'floor', value: 'floor', text: 'floor' },
  { key: 'owner', value: 'owner', text: 'owner' },
  { key: 'priority', value: 'priority', text: 'priority' },
  { key: 'room', value: 'room', text: 'room' },
  { key: 'status', value: 'status', text: 'status' },
  { key: 'votes', value: 'votes', text: 'votes' },
];

const dbDateFields = [
  { key: 'createdOn', value: 'createdOn', text: 'createdOn' },
  { key: 'updatedOn', value: 'updatedOn', text: 'updatedOn' },
];

/** Renders a table containing all of the Tickets documents. Use <TicketAdmin> to render each row. */
class ListTickets extends React.Component {
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
    this.mySort = this.mySort.bind(this);
    this.filtering = this.filtering.bind(this);
    this.lastMonth = this.lastMonth.bind(this);
    this.lastWeek = this.lastWeek.bind(this);
    this.timeFilter = this.timeFilter.bind(this);
    this.timeFilterOff = this.timeFilterOff.bind(this);

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
      sorts: ['building', 'priority'],
      temp_sorts: [this.mySort('buidling'), this.mySort('priority', false)],

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

  applySorts(coll) {
    // const arrSort = this.state.sorts;
    // const arrOfSorts = this.state.temp_sorts;
    // if (arrOfSorts.length > 0) {.find({}, { sort: { createdOn: -1 } }).fetch()
    //   function ()
    // }
    return _.orderBy(coll, ['building', 'priority'], ['asc', 'asc']);
    // return _.chain(coll).sortBy('building').sortBy('createdOn').value();
  }

  clearFilter = () => this.setState({ filters: [] });
  clearFilterInclusive = () => this.setState({ filters_inclusive: [] });

  mySort = (field) => function (coll) { return _.sortBy(coll, field); }

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

  has = (criteria) => function (value) { return _.includes(value, criteria); }

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

  // filtering = () => {
  //   const orgArr = this.state.temp_filter_array;
  //   if (orgArr.length > 0) {
  //     return _.filter(this.stae.tickets, function (t) {
  //       return _.every(arr, function (currentFunction) {
  //         return currentFunction(t);
  //       });
  //     });
  //   }
  //   return this.props.tickets;
  // };

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
    const f_list = this.state.filters;
    const f_list_inclusive = this.state.filters_inclusive;

    const collFilteredInclusive = this.filteringInclusive(f_list_inclusive);
    const collFiltered = this.filtering(f_list, collFilteredInclusive);
    const collSearched = collFiltered.filter((t) => t[this.state.search_field].indexOf(this.state.search) !== -1);
    // const timeSearchTickets = searched.filter((t) => moment(t.createdOn).isBefore(this.state.date_start));
    const collTimeSearchTickets = this.timeFilter(collSearched);
    const collSorted = this.applySorts(collTimeSearchTickets);
    // const timeSearchTickets = searched.filter((t) => this.state.time_filters);
    // const searched = this.quickQuery(filtered, s_field, s);

    // const ticketsAfterAllFilters = function () {
    //   return timeSearchTickets;
    // };

    return (
        <Container>
          <Header as="h2" textAlign="center" inverted>List of All Tickets</Header>
          <Menu>
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
            <Menu.Item>
              <Dropdown
                  button
                  name = 'search_date_field'
                  type = 'text'
                  placeholder = 'Date Field To Query'
                  options = {dbDateFields}
                  value = {this.state.search_date_field}
                  onChange = {this.handleChangeDateSearchField}
              />
              <DatePicker
                  showYearDropdown
                  isClearable={true}
                  selected = {this.state.date_start}
                  selectsStart
                  startDate={this.state.date_start}
                  endDate={this.state.date_end}
                  onChange = {this.handleChangeStart}
              />
              <DatePicker
                  showYearDropdown
                  isClearable={true}
                  selected = {this.state.date_end}
                  selectsEnd
                  startDate={this.state.date_start}
                  endDate={this.state.date_end}
                  onChange = {this.handleChangeEnd}
              />
            </Menu.Item>
            <Menu.Item
              name='days31last'
              onClick={this.lastMonth}
            >
              Last Month
            </Menu.Item>
            <Menu.Item
                name='days07last'
                onClick={this.lastWeek}
            >
              Last Week
            </Menu.Item>
            <Menu.Item
                name='timeFilterOff'
                onClick={this.timeFilterOff}
            >
              Time Filter Off
            </Menu.Item>
          </Menu>
          <Header textAlign='center' as='h3' inverted>Inclusive Filters</Header>
          <Menu>
            <Form.Input
                icon = 'search'
                placeholder = ''
                type = 'text'
                value = {this.state.temp_filter_inclusive}
                onChange = {this.getFilterInputInclusive}
            />
            <Menu.Item
                name='addFilter'
                onClick={this.addFilterInclusive}
            >
              Add Filter
            </Menu.Item>
            <Menu.Item
                name='clearFilter'
                onClick={this.clearFilterInclusive}
            >
              Clear Filter
            </Menu.Item>
          </Menu>
          <List>
            {f_list_inclusive.map((filter, index) => <Button key={index} content={filter}/>)}
          </List>
          <Header textAlign='center' as='h3' inverted>Exclusive Filters</Header>
          <Menu>
            <Form.Input
                icon = 'search'
                placeholder = ''
                type = 'text'
                value = {this.state.temp_filter}
                onChange = {this.getFilterInput}
            />
            <Menu.Item
                name='addFilter'
                onClick={this.addFilter}
            >
              Add Filter
            </Menu.Item>
            <Menu.Item
                name='clearFilter'
                onClick={this.clearFilter}
            >
              Clear Filter
            </Menu.Item>
          </Menu>
          <List>
            {f_list.map((filter, index) => <Button key={index} content={filter}/>)}
          </List>
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
              {collSorted.map((ticket, index) => <TicketAdmin key={index} ticket={ticket} />)}
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
  const subscription = Meteor.subscribe('TicketsAdmin');
  return {
    tickets: Tickets.find({}, { sort: { createdOn: -1 } }).fetch(),
    ready: subscription.ready(),
  };
})(ListTickets);
