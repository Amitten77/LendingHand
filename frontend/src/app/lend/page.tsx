"use client";
import React from 'react'
import LendingHand from '../../../../backend/src/abis/LendingHand.json'
import { useState, useEffect } from 'react';
import Web3 from 'web3';


type insideNetwork = {
  events: {};
  links: {};
  address: string;
  transactionHash: string;
}

type postType = {
  current: bigint
  description: string
  goal: bigint
  id:  bigint
  name: string
  numDonors: bigint
  owner: string
  reachedGoal: boolean
}

const Lend = () => {


  const [posts, setPosts] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)



  useEffect(() => {
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
        const postCount = await lendinghand.methods.postCount().call()
        if (typeof postCount === 'bigint') {
        for (var i = 1; i <= postCount; i++) {
          const post = await lendinghand.methods.posts(i).call()
          setPosts(posts => [...posts, post])
      }
      setLoading(false)
    }
     } else {
        window.alert('Please connect your Metamask Account to the Goerli TestNet')
      }
      
    }


    loadBlockchainData().catch(console.error)



  }, [])


  return (
    <div>
      { loading ?  <p>Loading....</p> :
          <div>
            <h1 className='text-4xl m-4'>Discover Fundraisers</h1>
            <div className='grid grid-rows-4 grid-cols-4 m-24'>
              {
            posts.map((post: any) => {
              return (
                <div key={post.name} className='m-4 bg-white'>
                  <img src="IlliniBlockchain.svg"></img>
                  <div className='flex justify-center flex-col items-center'>
                    <p className='font-bold'>{post.name}</p>
                    <p>Current Raised: {Number(post.current) / Math.pow(10, 18)} Eth</p>
                    <p>Goal: {Number(post.goal) / Math.pow(10, 18)} Eth</p>
                  </div>
                </div>
              )
            })
        }
          </div>
        </div>
        }
    </div>
  )
}

export default Lend