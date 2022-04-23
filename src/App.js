import React, { Component } from 'react';
import { Container, Row, Form, Button, Navbar } from 'react-bootstrap';
import Web3 from 'web3';
import ImageUpload from './ImageUpload';
import ConnectMetamask from './ConnectMetamask';

class App extends Component {
  componentDidMount() {
    this.load();
  }

  //checks for the network, and whether Metamask is installed
  async load() {
    const web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1');
    const network = await web3.eth.net.getNetworkType();
    console.log('network:', network);
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    }
  }

  render() {
    return (
      <div>
        <Navbar bg='dark' variant='dark'>
          <Container>
            <Navbar.Brand href='#home'>Block_KYC</Navbar.Brand>
            <ConnectMetamask />
          </Container>
        </Navbar>

        <Container fluid='md' gap='lg'>
          <ImageUpload key='upload' />
        </Container>
      </div>
    );
  }
}

export default App;
