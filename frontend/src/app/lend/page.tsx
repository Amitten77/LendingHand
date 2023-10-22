"use client";
import React from "react";
import LendingHand from "../../../../backend/src/abis/LendingHand.json";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { PulseLoader } from "react-spinners";

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
            setPosts((posts) => [...posts, post]);
          }
          setLoading(false);
        }
      } else {
        window.alert(
          "Please connect your Metamask Account to the Goerli TestNet"
        );
      }
    };

    loadBlockchainData().catch(console.error);
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <PulseLoader color="#3498db" size={25} />
        </div>
      ) : (
        <div>
          <h1 className="text-4xl font-semibold tracking-wider text-center text-rgb(240, 240, 240) p-5 rounded shadow-lg">
            Discover Fundraisers
          </h1>
          <div className="grid grid-cols-4 gap-12 m-4">
            {posts.map((post: any) => (
              <div
                key={post.name}
                className="p-4 bg-white shadow-lg rounded-md"
              >
                <img
                  src="IlliniBlockchain.svg"
                  alt="Illini Blockchain"
                  className="mb-4"
                />
                <div className="flex flex-col items-center justify-center">
                  <p className="font-bold text-xl mb-2">{post.name}</p>
                  <p className="text-sm mb-2">
                    Current Raised: {Number(post.current) / Math.pow(10, 18)}{" "}
                    Eth
                  </p>
                  <p className="text-sm">
                    Goal: {Number(post.goal) / Math.pow(10, 18)} Eth
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Lend;
