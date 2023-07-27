'use client'
import React from 'react'
import LendingHand from '../../../../backend/src/abis/LendingHand.json'
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import useAccount from '@/contexts/AuthContext';
import BigNumber from 'bignumber.js';





const CreatePost = () => {


  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({ title: '', description: '', goal: '' });
  const [lendinghand, setLendingHand] = useState<any>();
  const { account } = useAccount()

  useEffect(() => {
    console.log(account)
    console.log("HI")
    const loadBlockchainData = async () => {
      const web3 = new Web3(window.ethereum);
      //Load Account
      const networkId = await window.ethereum?.request({ method: 'net_version' });
      const networkData = LendingHand.networks[networkId as keyof typeof LendingHand.networks];
      if (networkData) {
        const abi = LendingHand.abi
        const address = networkData.address
        console.log(abi, address)
         const lendinghand = new web3.eth.Contract(abi, address)
         setLendingHand(lendinghand);
      setLoading(false)
    }
    else {
        window.alert('Please connect your Metamask Account to the Goerli TestNet')
      }
      
    }


    loadBlockchainData().catch(console.error)



  }, [])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('Form submitted:', formData);


    lendinghand.methods.createPost(formData.title, formData.description, BigNumber(formData.goal)).send({from: account }).once('receipt', (receipt: any) => {
      setLoading(false)
      })

    setFormData({ title: '', description: '', goal: '' });

    setLoading(true)
  }





  return (
    loading ? <p>Loading...</p> :
    <form onSubmit={handleOnSubmit}>
      <p>{account}</p>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <input type="description" id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="goal">Goal:</label>
        <textarea id="goal" name="goal" value={formData.goal} onChange={handleChange} required />
      </div>
      <button type="submit">Submit</button>
    </form>
    
  )
}

export default CreatePost