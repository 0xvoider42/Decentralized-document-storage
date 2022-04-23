import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { create } from 'ipfs-http-client';
import { useState } from 'react';
import { ContractABI, ContractAddress } from './ContractABI';
import Web3 from 'web3';
const client = create('https://ipfs.infura.io:5001/api/v0');
const web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1');

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [urlArr, setUrlArr] = useState([]);

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      console.log('Buffer data: ', Buffer(reader.result));
    };

    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    };

    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const defaultAcc = account[0].toString();
      const created = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      setUrlArr((prev) => [...prev, url]);
      const data = {
        name,
        description,
        image: url,
      };
      const metaData = JSON.stringify(data);
      const createMeta = await client.add(metaData);
      const metaUrl = `https://ipfs.infura.io/ipfs/${createMeta.path}`;
      const contract = new web3.eth.Contract(ContractABI, ContractAddress);
      const resp = await contract.methods.mint(metaUrl).send({ from: defaultAcc });
      const tokenId = resp.events.Transfer.returnValues.tokenId;
      alert(
        `Upload successfully initiated. Contract address: ${ContractAddress} \n Token ID: ${tokenId}`
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='App'>
      <form className='form' onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='formBasicEmail' key='1'>
          <Form.Label key='2'>Full Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            key='3'
          />
          <Form.Text className='text-muted' key='4'>
            Please fill in your legal full name, as in your official document.
          </Form.Text>
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicPassword' key='5'>
          <Form.Label key='6'>Bank account</Form.Label>
          <Form.Control
            type='text'
            placeholder='address'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            key='7'
          />
        </Form.Group>
        <input type='file' name='data' onChange={retrieveFile} />
        <Button variant='primary' type='submit' key='8'>
          Submit
        </Button>
      </form>
      <div className='display'>
        {urlArr.length !== 0 ? (
          urlArr.map((el) => <img src={el} alt='nfts' />)
        ) : (
          <h3>Waiting to upload</h3>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
