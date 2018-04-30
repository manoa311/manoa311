import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accordion, Button, Container, Dropdown,
  Form, Header, Icon, List, Loader, Menu, Table } from 'semantic-ui-react';
import { Tickets } from '/imports/api/ticket/ticket';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import TicketAdmin from '/imports/ui/components/TicketAdmin';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';

const dbAllFields = [
  { key: 0, value: 'building', text: 'building' },
  { key: 1, value: 'description', text: 'description' },
  { key: 2, value: 'floor', text: 'floor' },
  { key: 3, value: 'owner', text: 'owner' },
  { key: 4, value: 'priority', text: 'priority' },
  { key: 5, value: 'room', text: 'room' },
  { key: 6, value: 'status', text: 'status' },
  { key: 7, value: 'votes', text: 'votes' },
  { key: 8, value: 'createdOn', text: 'createdOn' },
  { key: 9, value: 'updatedOn', text: 'updatedOn' },
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
    this.clearFilter = this.clearFilter.bind(this);
    this.clearFilterInclusive = this.clearFilterInclusive.bind(this);
    this.getFilterInput = this.getFilterInput.bind(this);
    this.getFilterInputInclusive = this.getFilterInputInclusive.bind(this);
    this.getSearchInput = this.getSearchInput.bind(this);
    this.handleChangeDropDown = this.handleChangeDropDown.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.has = this.has.bind(this);
    this.filtering = this.filtering.bind(this);
    this.lastMonth = this.lastMonth.bind(this);
    this.lastWeek = this.lastWeek.bind(this);
    this.timeFilter = this.timeFilter.bind(this);
    this.timeFilterOff = this.timeFilterOff.bind(this);

    this.state = {
      data: [],
      search: '',
      search_field: 'building',
      search_date_field: 'createdOn',
      search_date_type: '',
      date_start: moment(),
      date_end: moment(),
      search_time: false,
      filter_building: [this.has('Webster'), this.has('Sakamaki'), this.has('Critical')],
      filter_priority: [this.has('Regular')],
      filters: [],
      filters_inclusive: [],
      sort_fields: [],
      sort_orders: [],
      time_filter_active: false,
      temp_filter: [],
      temp_filter_inclusive: [],
      temp_sort_field: '',
      temp_sort_order: '',
      activeIndex: -1,

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
    const currArrOrder = this.state.sort_fields;
    const newArrOrder = currArrOrder.concat(this.state.temp_sort_order);
    this.setState({ sort_fields: newArrField });
    this.setState({ sort_orders: newArrOrder });
    this.setState({ temp_filter_field: '' });
    this.setState({ temp_filter_order: '' });
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

  getFilterInput = (event) => this.setState({ temp_filter: event.target.value.substr(0, 20) });
  getFilterInputInclusive = (event) => this.setState({ temp_filter_inclusive: event.target.value.substr(0, 20) });

  getSearchInput = (event) => this.setState({ search: event.target.value.substr(0, 20) });

  handleChangeDropDown = (e, { name, value }) => this.setState({ [name]: value });

  handleChangeStart = (date) => this.setState({ date_start: date });
  handleChangeEnd = (date) => this.setState({ date_end: date });

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  has = (criteria) => function (value) { return _.includes(value, criteria); }

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
    this.setState({ date_start: moment().subtract(31, 'days') });
    this.setState({ time_filter_active: true });
  }

  lastWeek() {
    this.setState({ date_start: moment().subtract(7, 'days') });
    this.setState({ time_filter_active: true });
  }

  timeFilterOff = () => this.setState({ time_filter_active: false });
  timeFilterOn = () => this.setState({ time_filter_active: true });

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
          </Menu>
          <Accordion styled>
            <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Time Filter
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <Menu>
                <Menu.Item>
                  <Dropdown
                      button
                      name = 'search_date_type'
                      type = 'text'
                      placeholder = 'Date Field To Query'
                      options = {_.filter(timeSearchType)}
                      value = {this.state.search_date_type}
                      onChange = {this.handleChangeDropDown}
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
                    name='applyTimeFilter'
                    onClick={this.timeFilterOn}
                >
                  Apply Filter
                </Menu.Item>
                <Menu.Item
                    name='timeFilterOff'
                    onClick={this.timeFilterOff}
                >
                  Time Filter Off
                </Menu.Item>
              </Menu>
            </Accordion.Content>

          </Accordion>
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
          <Header textAlign='center' as='h3' inverted>Sorts</Header>
          <Menu>
            <Dropdown
                button
                name = 'temp_sort_field'
                type = 'text'
                placeholder = 'Sort Fields'
                options = {dbAllFields}
                value = {this.state.temp_sort_field}
                onChange = {this.handleChangeDropDown}
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
            <Menu.Item
                name='addSort'
                onClick={this.addSort}
            >
              Add Filter
            </Menu.Item>
            <Menu.Item
                name='clearSort'
                onClick={this.clearSort}
            >
              Clear Filter
            </Menu.Item>
          </Menu>
          <List>
            {s_list.map((filter, index) => <Button key={index} content={filter}/>)}
          </List>
          <Table compact striped>
            <Table.Header>
              <Table.Row>
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
