import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accordion, Button, Container, Dropdown,
  Form, Header, Icon, List, Loader, Menu, Pagination, Table } from 'semantic-ui-react';
import { Tickets } from '/imports/api/ticket/ticket';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import TicketAdmin from '/imports/ui/components/TicketAdmin';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';

const dbAllFields = [
  { key: 0, value: 'building', text: 'Building' },
  { key: 1, value: 'description', text: 'Description' },
  { key: 2, value: 'floor', text: 'Floor' },
  { key: 3, value: 'owner', text: 'Owner' },
  { key: 4, value: 'priority', text: 'Priority' },
  { key: 5, value: 'room', text: 'Room' },
  { key: 6, value: 'status', text: 'Status' },
  { key: 7, value: 'votes', text: 'Votes' },
  { key: 8, value: 'createdOn', text: 'Created' },
  { key: 9, value: 'updatedOn', text: 'Updated' },
];

const sortOrder = [
  { key: 'ascending', value: 'asc', text: 'Ascending' },
  { key: 'descending', value: 'desc', text: 'Descending' },
];

const timeSearchType = [
  { key: 0, value: 'after', text: 'Before Date' },
  { key: 1, value: 'before', text: 'After Date' },
  { key: 2, value: 'range', text: 'Between Dates' },
];

/** Renders a table containing all of the Tickets documents. Use <TicketAdmin> to render each row. */
class ListTickets extends React.Component {
  constructor() {
    super();

    this.addFilter = this.addFilter.bind(this);
    this.addFilterInclusive = this.addFilterInclusive.bind(this);
    this.addSort = this.addSort.bind(this);
    this.allNewOnly = this.allNewOnly.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.clearFilterInclusive = this.clearFilterInclusive.bind(this);
    this.getFilterInput = this.getFilterInput.bind(this);
    this.getFilterInputInclusive = this.getFilterInputInclusive.bind(this);
    this.getSearchInput = this.getSearchInput.bind(this);
    this.getSortField = this.getSortField.bind(this);
    this.getSortOrder = this.getSortOrder.bind(this);
    this.handleChangeDropDown = this.handleChangeDropDown.bind(this);
    this.handleChangeDropDownTimeFilter = this.handleChangeDropDownTimeFilter.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.has = this.has.bind(this);
    this.filtering = this.filtering.bind(this);
    this.lastMonth = this.lastMonth.bind(this);
    this.lastWeek = this.lastWeek.bind(this);
    this.removeFilterExclusive = this.removeFilterExclusive.bind(this);
    this.removeFilterInclusive = this.removeFilterInclusive.bind(this);
    this.timeFilterSwitch = this.timeFilterSwitch.bind(this);

    this.state = {
      activeIndexTime: -1,
      activeIndexInclusive: -1,
      data: [],
      date_start: moment(),
      date_end: moment(),
      date_picker_start: true,
      date_picker_end: true,
      filter_all_new: false,
      filter_building: [this.has('Webster'), this.has('Sakamaki'), this.has('Critical')],
      filter_priority: [this.has('Regular')],
      filters: [],
      filters_inclusive: [],
      search: '',
      search_field: 'building',
      search_date_field: 'createdOn',
      search_date_type: '',
      search_time: false,
      sort_fields: [],
      sort_orders: [],
      time_filter_active: false,
      time_filter_active_month: false,
      time_filter_active_week: false,
      time_filter_status: 'Time Filter On',
      temp_filter: [],
      temp_filter_inclusive: [],
      temp_sort_field: '',
      temp_sort_order: '',
      tickets_page: 1,
      tickets_per_page: 5,
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

  addSort() {
    const currArrField = this.state.sort_fields;
    const newArrField = currArrField.concat(this.state.temp_sort_field);
    const currArrOrder = this.state.sort_orders;
    const newArrOrder = currArrOrder.concat(this.state.temp_sort_order);
    this.setState({ sort_fields: newArrField });
    this.setState({ sort_orders: newArrOrder });
    this.setState({ temp_filter_field: '' });
    this.setState({ temp_filter_order: '' });
  }

  allNewOnly() {
    const allNew = this.state.filter_all_new;
    if (allNew) {
      const orgArr = this.state.filters;
      const newArr = _.remove(orgArr, function (n) { return !(n === 'New'); });
      this.setState({ filters: newArr, filter_all_new: false });
      this.setState({ temp_filter_array: _.map(newArr, this.has) });
    } else {
      const currArr = this.state.filters;
      const newArr = currArr.concat('New');
      this.setState({ filters: newArr, filter_all_new: true });
      this.setState({ temp_filter_array: _.map(newArr, this.has) });
    }
  }

  applySorts(coll) {
    const arrSortFields = this.state.sort_fields;
    const arrSortOrders = this.state.sort_orders;
    if (arrSortFields.length > 0) {
      return _.orderBy(coll, arrSortFields, arrSortOrders);
    }
    return coll;
  }

  clearFilter = () => this.setState({ filters: [] });
  clearFilterInclusive = () => this.setState({ filters_inclusive: [] });

  clearSort = () => { this.setState({ sort_fields: [] }); this.setState({ sort_orders: [] }); }

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

  getFilterInput = (event) => this.setState({ temp_filter: event.target.value.substr(0, 20) });
  getFilterInputInclusive = (event) => this.setState({ temp_filter_inclusive: event.target.value.substr(0, 20) });

  getSearchInput = (event) => this.setState({ search: event.target.value.substr(0, 20) });
  getSortField = (field) => _.head(field);
  getSortOrder(field) {
    if (_.last(field) === 'desc') {
      return 'sort content descending';
    }
    return 'sort content ascending';
  }

  handleChangeDropDown = (e, { name, value }) => this.setState({ [name]: value });
  handleChangeDropDownTimeFilter = (e, { name, value }) => {
    this.setState({ [name]: value });
    switch (value) {
      case 'range':
        this.setState({ date_picker_start: false, date_picker_end: false });
        break;
      default:
        this.setState({ date_picker_start: false, date_picker_end: true });
    }
  }

  handleChangeStart = (date) => this.setState({ date_start: date });
  handleChangeEnd = (date) => this.setState({ date_end: date });

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  handlePaginationChange = (e, { activePage }) => this.setState({ tickets_page: activePage })
  has = (criteria) => function (value) { return _.includes(value, criteria); }

  lastMonth() {
    this.setState({ date_start: moment().subtract(31, 'days') });
    if (this.state.time_filter_active_month === false) {
      this.setState({ time_filter_active_month: true, time_filter_status: 'Time Filter Off' });
      if (this.state.time_filter_active === false) {
        this.setState({ time_filter_active: true });
      }
    } else {
      this.setState({ time_filter_active: false, time_filter_active_month: false,
        time_filter_status: 'Time Filter On' });
    }
  }

  lastWeek() {
    this.setState({ date_start: moment().subtract(7, 'days') });
    if (this.state.time_filter_active_week === false) {
      this.setState({ time_filter_active_week: true, time_filter_status: 'Time Filter Off' });
      if (this.state.time_filter_active === false) {
        this.setState({ time_filter_active: true });
      }
    } else {
      this.setState({
        time_filter_active: false, time_filter_active_week: false,
        time_filter_status: 'Time Filter On' });
    }
  }

  removeFilterExclusive(e, titleProps) {
    const content = titleProps.mycontent;
    const orgArr = this.state.filters;
    const newArr = _.remove(orgArr, function (n) { return !(content === n); });
    this.setState({ filters: newArr });
    this.setState({ temp_filter_array: _.map(newArr, this.has) });
  }

  removeFilterInclusive(e, titleProps) {
    const content = titleProps.mycontent;
    const orgArr = this.state.filters_inclusive;
    const newArr = _.remove(orgArr, function (n) { return !(content === n); });
    this.setState({ filters_inclusive: newArr });
    this.setState({ temp_filter_array_inclusive: _.map(newArr, this.has) });
  }

  timeFilterSwitch = () => {
   this.setState({
      time_filter_active: !this.state.time_filter_active,
      time_filter_active_month: false,
      time_filter_active_week: false,
    });

   if (this.state.time_filter_active) {
     this.setState({ time_filter_status: 'Time Filter Off' });
   } else {
     this.setState({ time_filter_status: 'Time Filter On' });
   }
  }

  timeFilter(coll) {
    const filterOn = this.state.time_filter_active;
    const filterType = this.state.search_date_type;
    const sDate = this.state.date_start;
    const eDate = this.state.date_end;

    if (filterOn && (sDate !== null) && (filterType !== null)) {
      const field_to_query = this.state.search_date_field;

      switch (filterType) {
        case 'after':
          return coll.filter((t) => moment(t[field_to_query]).isBefore(moment(sDate).startOf('day')), 'day');
        case 'before':
          return coll.filter((t) =>
              moment(t[field_to_query]).isAfter(moment(sDate).endOf('day')), 'day');
        case 'range':
          return coll.filter((t) =>
              moment(t[field_to_query]).isBetween(moment(sDate).startOf('day'), moment(eDate).endOf('day')), 'day');
        default:
          return coll.filter((t) =>
              moment(t[field_to_query]).isSameOrAfter(sDate.endOf('day')), 'day');
      }
    }
    return coll;
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const activeIndex = this.state.activeIndex;
    const f_list = this.state.filters;
    const f_list_inclusive = this.state.filters_inclusive;
    const s_list = _.zip(this.state.sort_fields, this.state.sort_orders);
    const collFilteredInclusive = this.filteringInclusive(f_list_inclusive);
    const collFiltered = this.filtering(f_list, collFilteredInclusive);
    const collSearched = collFiltered.filter((t) => t[this.state.search_field].indexOf(this.state.search) !== -1);
    const collTimeSearchTickets = this.timeFilter(collSearched);
    const collSorted = this.applySorts(collTimeSearchTickets);
    const currentPage = this.state.tickets_page;
    const ticketsPerPage = this.state.tickets_per_page;
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const finalSetOfTickets = collSorted.slice(indexOfFirstTicket, indexOfLastTicket);
    const maxPage = Math.ceil(collSorted.length / ticketsPerPage);

    return (
        <Container>
          <Header as="h2" textAlign="center" inverted>My Tickets</Header>
          <Menu>
            <Menu.Item>
              <Dropdown
                  button
                  name = 'search_field'
                  type = 'text'
                  placeholder = 'Search Fields'
                  options = {_.filter(dbAllFields, (i) => i.key < 8)}
                  value = {this.state.search_field}
                  onChange = {this.handleChangeDropDown}
              />
              <Form.Input
                  icon = 'search'
                  placeholder = ''
                  type = 'text'
                  value = {this.state.search}
                  onChange = {this.getSearchInput}
              />
            </Menu.Item>
            <Menu.Item
                name='allNewOnly'
                active={this.state.filter_all_new}
                onClick={this.allNewOnly}
            >
              All New Only
            </Menu.Item>
            <Menu.Item
                name='days31last'
                active={this.state.time_filter_active_month}
                onClick={this.lastMonth}
            >
              Last Month
            </Menu.Item>
            <Menu.Item
                name='days07last'
                active={this.state.time_filter_active_week}
                onClick={this.lastWeek}
            >
              Last Week
            </Menu.Item>

            <Dropdown
                button
                name = 'temp_sort_field'
                type = 'text'
                placeholder = 'Sort Fields'
                options = {dbAllFields}
                value = {this.state.temp_sort_field}
                onChange = {this.handleChangeDropDownTimeFilter}
            />
            <Dropdown
                button
                name = 'temp_sort_order'
                type = 'text'
                placeholder = 'Sort Order'
                options = {sortOrder}
                value = {this.state.temp_sort_order}
                onChange = {this.handleChangeDropDown }
            />
            <Button
                fitted
                name='addSort'
                onClick={this.addSort}
                disabled={!(this.state.temp_sort_field && this.state.temp_sort_order)}
            >
              Add Sort
            </Button>
            <Button
                fitted
                name='clearSort'
                onClick={this.clearSort}
            >
              Clear Sorts
            </Button>
            <List>
              {s_list.map((sort, index) =>
                  <Menu.Item key={index} content={sort}>
                    {this.getSortField(sort)} <Icon name={this.getSortOrder(sort)} />
                  </Menu.Item>)}
            </List>

          </Menu>
          <Accordion fluid styled>
            <Accordion.Title
                name = 'activeIndexTime'
                active={this.state.activeIndexTime === 0} index={0} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Time Filter
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <Menu>
                <Dropdown
                    button
                    name = 'search_date_type'
                    type = 'text'
                    placeholder = 'Date Field To Query'
                    options = {timeSearchType}
                    value = {this.state.search_date_type}
                    onChange = {this.handleChangeDropDownTimeFilter}
                />
                <Dropdown
                    button
                    name = 'search_date_field'
                    type = 'text'
                    placeholder = 'Date Field To Query'
                    options = {_.filter(dbAllFields, (i) => i.key > 7)}
                    value = {this.state.search_date_field}
                    onChange = {this.handleChangeDropDown}
                />
                <Menu.Item active={this.state.date_picker_start}>
                  <DatePicker
                      showYearDropdown
                      disabled={this.state.date_picker_start}
                      isClearable={true}
                      selected = {this.state.date_start}
                      selectsStart
                      startDate={this.state.date_start}
                      endDate={this.state.date_end}
                      onChange = {this.handleChangeStart}
                  />
                </Menu.Item>
                <Menu.Item active={this.state.date_picker_end}>
                  <DatePicker
                      disabled={this.state.date_picker_end}
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
                    name='applyTimeFilter'
                    onClick={this.timeFilterSwitch}
                >
                  {this.state.time_filter_status}
                </Menu.Item>
              </Menu>
            </Accordion.Content>
            <Accordion.Title name = 'activeIndexInclusive'
                             active={this.state.activeIndex === 1} index={1} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Text Filters
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
              <Menu>
                <Form.Input
                    icon = 'search'
                    placeholder = 'Inclusive Filter'
                    type = 'text'
                    value = {this.state.temp_filter_inclusive}
                    onChange = {this.getFilterInputInclusive}
                />
                <Menu.Item
                    name='addFilter'
                    onClick={this.addFilterInclusive}
                >
                  Add Inclusive Filter
                </Menu.Item>
                <Menu.Item
                    name='clearFilter'
                    onClick={this.clearFilterInclusive}
                >
                  Clear Inclusive Filter
                </Menu.Item>
              </Menu>
              <List>
                {f_list_inclusive.map((filter, index) =>
                    <Button key={index} mycontent={filter} onClick={this.removeFilterInclusive}>
                      {filter}
                      <Icon name = 'delete' />
                    </Button>)}
              </List>
              <Menu>
                <Form.Input
                    icon = 'search'
                    placeholder = 'Exclusive Filter'
                    type = 'text'
                    value = {this.state.temp_filter}
                    onChange = {this.getFilterInput}
                />
                <Menu.Item
                    name='addFilter'
                    onClick={this.addFilter}
                >
                  Add Exclusive Filter
                </Menu.Item>
                <Menu.Item
                    name='clearFilter'
                    onClick={this.clearFilter}
                >
                  Clear Exclusive Filter
                </Menu.Item>
              </Menu>
              <List>
                {f_list.map((filter, index) =>
                    <Button name = 'activeIndexExclusive'
                            key={index} mycontent={filter} onClick={this.removeFilterExclusive}>
                      {filter}
                      <Icon name = 'delete' />
                    </Button>)}
              </List>
            </Accordion.Content>
          </Accordion>
          <Table compact striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  View Ticket
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Priority
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Ticket Status
                </Table.HeaderCell>
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
                  Description
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Votes
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
              {finalSetOfTickets.map((ticket, index) => <TicketAdmin key={index} ticket={ticket} />)}
            </Table.Body>
          </Table>
          <Pagination activePage={currentPage} onPageChange={this.handlePaginationChange} totalPages={maxPage} />
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
