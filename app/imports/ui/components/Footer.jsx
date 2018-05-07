import React from 'react';
import { Container, Icon, Menu, Button, Popup, Image } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const divStyle = { paddingTop: '15px', color: 'white', backgroundColor: '#024731' };
    const style = {
      borderRadius: 0,
      opacity: 0.8,
      padding: '.5em',
    };
    return (
        <footer>
          <div style={divStyle} className="ui center aligned container">
            <hr />
            <Container>
              <Menu style={divStyle} borderless inverted widths={3}>
                <Menu.Item name='landing' onClick={this.handleItemClick} as={NavLink} activeClassName="" exact to="/"><Image src='/images/manoa311logo.png' size='medium'/></Menu.Item>
                <Menu.Item onClick={this.handleItemClick} as={NavLink} activeClassName="" exact to="/about">About us</Menu.Item>
                <Menu.Item position="right"><Popup
                    trigger= {<Button circular color='facebook' icon='facebook' href="https://www.facebook.com/share"/>} content='Share on Facebook' style={style} />
                  <Popup
                      trigger= {<Button circular color='twitter' icon='twitter' href="https://www.twitter.com/share"/>} content='Share on Twitter' style={style} />
                  <Popup
                      trigger= {<Button circular color='red' icon='pinterest' href="https://www.pinterest.com/share"/>} content='Share on Pinterest' style={style} />
                  <Popup
                      trigger= {<Button circular color='instagram' icon='instagram'href="https://instagram/share"/>} content='Share on Instagram' style={style} /></Menu.Item>
              </Menu>
            </Container>
            <hr />
          </div>
        </footer>
    );
  }
}

export default Footer;
