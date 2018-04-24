import _ from 'lodash'
import React from 'react';
import { Table, Input, Dropdown, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';


/** Table template from https://react.semantic-ui.com/collections/table#table-example-sortable */

/** Selectable cells from https://react.semantic-ui.com/collections/table#table-example-selectable-cell */

const sampleData = [
  { status: 'Unresolved', ticketName: 'Broken door handle', building: 'POST', room: '1st floor Mens bathroom', issuedBy: 'John (john@hawaii.edu)', dateCreated: '2018-02-07 12:05', dateUpdated: 'No Update' },
  { status: 'Resolved', ticketName: 'Broken window', building: 'Saunders Hall', room: 'Room 621E', issuedBy: 'Jack (jack@hawaii.edu)', dateCreated: '2018-03-15 16:05', dateUpdated: '2018-04-08 11:02' },
  { status: 'Resolved', ticketName: 'Missing trashcan', building: 'Hamilton Library', room: '3rd floor Womens bathroom', issuedBy: 'Martha (martha@hawaii.edu)', dateCreated: '2017-08-09 8:05', dateUpdated: '2017-09-03 12:05' },
  { status: 'Received', ticketName: 'Flickering lightbulb', building: 'Keller Hall', room: 'Room 303', issuedBy: 'Wendy (wendy@hawaii.edu)', dateCreated: '2018-01-22 12:38', dateUpdated: '2018-03-21' }
]


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

  render() {
    const { column, data, direction } = this.state
    const props = {
      sorted: column === 'status' ? direction : null
    };

    return (
        <div className='background-landing'>
          <Menu>
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
              <Input icon='search' placeholder='Search tickets...' />
            </Menu.Item>
          </Menu>
          <Table sortable celled selectable fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell onClick={this.handleSort('Status')} {...props}>
                  Status
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'ticketName' ? direction : null} onClick={this.handleSort('Ticket Name')}>
                  Ticket Name
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'building' ? direction : null} onClick={this.handleSort('Building')}>
                  Building
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'room' ? direction : null} onClick={this.handleSort('Room')}>
                  Room
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'issuedBy' ? direction : null} onClick={this.handleSort('Issued By')}>
                  Issued By
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'dateCreated' ? direction : null} onClick={this.handleSort('Date Created')}>
                  Date Created
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'dateUpdated' ? direction : null} onClick={this.handleSort('Date Updated')}>
                  Date Updated
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell negative selectable><Link to={`/view/`}>Unresolved</Link></Table.Cell>
                <Table.Cell>Broken door handle</Table.Cell>
                <Table.Cell>POST</Table.Cell>
                <Table.Cell>1st floor Mens bathroom</Table.Cell>
                <Table.Cell selectable>John (john@hawaii.edu)</Table.Cell>
                <Table.Cell>2018-02-07 12:05</Table.Cell>
                <Table.Cell negative>No Update</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell positive selectable><Link to={`/view/`}>Resolved</Link></Table.Cell>
                <Table.Cell>Broken window</Table.Cell>
                <Table.Cell>Saunders Hall</Table.Cell>
                <Table.Cell>Room 621E</Table.Cell>
                <Table.Cell selectable>Jack (jack@hawaii.edu)</Table.Cell>
                <Table.Cell>2018-03-15 16:05</Table.Cell>
                <Table.Cell positive>2018-04-08 11:02</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell positive selectable><Link to={`/view/`}>Resolved</Link></Table.Cell>
                <Table.Cell>Missing trashcan</Table.Cell>
                <Table.Cell>Hamilton Library</Table.Cell>
                <Table.Cell>3rd floor Womens bathroom</Table.Cell>
                <Table.Cell selectable>Martha (martha@hawaii.edu)</Table.Cell>
                <Table.Cell>2018-08-09 08:05</Table.Cell>
                <Table.Cell positive>2017-09-03 12:05</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell warning selectable><Link to={`/view/`}>Received</Link></Table.Cell>
                <Table.Cell>Flickering lightbulb</Table.Cell>
                <Table.Cell>Keller Hall</Table.Cell>
                <Table.Cell>Room 303</Table.Cell>
                <Table.Cell selectable>Wendy (wendy@hawaii.edu)</Table.Cell>
                <Table.Cell>2018-01-22 12:38</Table.Cell>
                <Table.Cell warning>2018-03-21 12:51</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
    );
  }
}

export default Landing;
