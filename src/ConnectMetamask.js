import Web3 from 'web3';
import { useState } from 'react';
import { Container, Col, Badge, Button } from 'react-bootstrap';

const ConnectMetamask = () => {
  const [error, setError] = useState(null);
  const [defaultAcc, setDefaultAcc] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [button, setButton] = useState('Connect Metamask');
  const web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1');

  const accountChangeHandler = (newAccount) => {
    setDefaultAcc(newAccount);
    getBalance(newAccount.toString());
  };

  const connectWallet = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((result) => {
        accountChangeHandler(result[0]);
        getBalance(result[0]);

        setButton('Metamask connected');
      });
    } else {
      setError('Metamask extension not detected!');
    }
  };

  const getBalance = (account) => {
    window.ethereum
      .request({ method: 'eth_getBalance', params: [account, 'latest'] })
      .then((balance) => {
        setUserBalance(web3.utils.fromWei(balance));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  window.ethereum.on('accountChanged', accountChangeHandler);

  return (
    <Container>
      <Col md={{ span: 4, offset: 9 }}>
        <Button variant='primary' type='connect' onClick={connectWallet}>
          {button}
        </Button>
        <Badge pill bg='success'>
          My address: {defaultAcc}
        </Badge>
        <Badge pill bg='info'>
          My balance: {userBalance} ETH
        </Badge>
      </Col>
      {error}
    </Container>
  );
};

export default ConnectMetamask;
