"use client";
import React from "react";
import LendingHand from "../../../../backend/src/abis/LendingHand.json";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { PulseLoader } from "react-spinners";
import { YourContractABI, lend } from "./lendConstants";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Import firestore

type insideNetwork = {
  events: {};
  links: {};
  address: string;
  transactionHash: string;
};

type postType = {
  current: bigint;
  description: string;
  goal: bigint;
  id: bigint;
  name: string;
  numDonors: bigint;
  owner: string;
  reachedGoal: boolean;
};



const Lend = () => {
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  

  // Existing useEffect and connectAndExecute function...

  const handleDonateClick = (post: any) => {
    // You might want to pass some post-specific data here if needed
    setShowModal(true);
  };

  const handleConfirmDonation = async () => {
    console.log(donationAmount);
    setShowModal(false);
    // await connectAndExecute(donationAmount);
  };

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(window.ethereum);
      //Load Account
      const networkId = await window.ethereum?.request({
        method: "net_version",
      });
      const networkData =
        LendingHand.networks[networkId as keyof typeof LendingHand.networks];
      if (networkData) {
        const abi = LendingHand.abi;
        const address = networkData.address;
        console.log(abi, address);
        const lendinghand = new web3.eth.Contract(abi, address);
        const postCount = await lendinghand.methods.postCount().call();
        if (typeof postCount === "bigint") {
          for (var i = 1; i <= postCount; i++) {
            const post = await lendinghand.methods.posts(i).call();
            // setPosts((posts) => [...posts, post]);
          }
          setLoading(false);
        }
      } else {
        window.alert(
          "Please connect your Metamask Account to the Goerli TestNet"
        );
      }

    };

    const fetchPosts = async () => {
      setLoading(true);
      try {
          const querySnapshot = await getDocs(collection(db, "posts"));
          const postsArray:any = [];
          querySnapshot.forEach((doc) => {
              postsArray.push({ id: doc.id, ...doc.data() });
          });
          setPosts(postsArray);
      } catch (error) {
          console.error("Error fetching posts:", error);
      }
      setLoading(false);
  };

  fetchPosts();
  

    // loadBlockchainData().catch(console.error);
  }, []);

  async function connectAndExecute() {
    if (typeof (window as any).ethereum !== 'undefined') {
        const web3 = new Web3((window as any).ethereum);
        try {
            await (window as any).ethereum.enable(); // Request account access
        } catch (error) {
            console.error('User denied account access:', error);
            return;
        }
        

        // Set the contract address and ABI
        const contractAddress = '0x35D03E63Ff21cc226E03E11383fc0a82C123b5E6';
        const contractABI = LendingHand.abi; // Replace with your contract's ABI

        // Create a contract instance
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        try {
            // Call a function from your smart contract
            const result = await contract.methods.donateToPost().call();
            // Display the result
            alert(`Smart Contract Result: ${result}`);
        } catch (error) {
            console.error('Error calling smart contract function:', error);
        }
    } else {
        console.error('No web3 provider detected. Please install MetaMask or use an Ethereum-compatible browser.');
    }
}

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <PulseLoader color="#3498db" size={25} />
        </div>
      ) : (
        <div>
          <h1 className="text-4xl font-semibold tracking-wider text-center text-rgb(240, 240, 240) p-5 rounded shadow-lg">
            Lend a Hand 
          </h1>
          <div className="grid grid-cols-4 gap-12 m-4">
            {posts.map((post: any) => (
              <div
  key={post.name}
  className="p-6 bg-white shadow-xl rounded-lg"
>
  <img
    src="IlliniBlockchain.svg"
    alt="Illini Blockchain"
    className="mb-6"
  />
  <div className="flex flex-col items-center justify-center">
    <h2 className="font-bold text-2xl mb-3">{post.title}</h2>
    <p className="text-md mb-3">{post.description}</p> {/* Added description */}
    <div className="mb-3">
  <span className="text-sm font-semibold">Current Raised: </span>
  <span className="text-sm">
    {post.currency === 'ETH' ? Number(post.current) : `${Number(post.current)} * 10^${post.currency === 'GWEI' ? '9' : '18'}`} {post.currency}
  </span>
</div>
<div className="mb-4">
  <span className="text-sm font-semibold">Goal: </span>
  <span className="text-sm">
    {post.currency === 'ETH' ? Number(post.goal) : `${Number(post.goal)} * 10^${post.currency === 'GWEI' ? '9' : '18'}`} {post.currency}
  </span>
</div>
<div className="mb-4">
  <span className="text-sm font-semibold">Deadline:</span>
  <span className="text-sm"> {post.deadline}</span>
</div>


    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-4"
      onClick={() => handleDonateClick(post)}
    >
      Donate
    </button>
  </div>
</div>

            ))}

            {showModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                <div className="bg-white rounded-lg shadow p-5">
                  <span
                    className="close text-black float-right text-2xl cursor-pointer hover:text-gray-600"
                    onClick={() => setShowModal(false)}
                  >
                    &times;
                  </span>
                  <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm Your Donation
                    </h3>
                    <div className="mt-2">
                      <p>Enter the amount you want to donate:</p>
                      <input
                        type="number"
                        value={donationAmount}
                        onChange={(e) =>
                          setDonationAmount(Number(e.target.value))
                        }
                        className="mt-2 p-2 border rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                        onClick={handleConfirmDonation}
                      >
                        Confirm Donation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Lend;
