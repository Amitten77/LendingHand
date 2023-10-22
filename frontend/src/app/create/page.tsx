"use client";
import React from "react";
import LendingHand from "../../../../backend/src/abis/LendingHand.json";
import { useState, useEffect } from "react";
import Web3 from "web3";
import useAccount from "@/contexts/AuthContext";
import BigNumber from "bignumber.js";

import { BeatLoader } from "react-spinners";

const CreatePost = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    deadline: "",
    currency: "",
  });
  const [lendinghand, setLendingHand] = useState<any>();
  const [web3, setWeb3] = useState<any>();
  const { account } = useAccount();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    console.log(account);
    console.log("HI");
    const loadBlockchainData = async () => {
      const init_web3 = new Web3(window.ethereum);
      if (init_web3) {
        setWeb3(init_web3);
      }
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
        const lendinghand = new init_web3.eth.Contract(abi, address);
        setLendingHand(lendinghand);
        setLoading(false);
      } else {
        window.alert(
          "Please connect your Metamask Account to the Goerli TestNet"
        );
      }
    };

    loadBlockchainData().catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submitted:", formData);

    lendinghand.methods
      .createPost(
        formData.title,
        formData.description,
        web3.utils.toWei(formData.goal, "ether")
      )
      .send({ from: account[0] })
      .once("receipt", (receipt: any) => {
        setLoading(false);
      });

    setFormData({
      title: "",
      description: "",
      goal: "",
      deadline: "",
      currency: "",
    });

    setLoading(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
}

  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
          <BeatLoader color="#3498db" size={25} />
    </div>
  ) : (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <form
        onSubmit={handleOnSubmit}
        className="space-y-6 bg-white p-6 rounded-md shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create Fundraiser
        </h2>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-600"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200 appearance-none transition duration-150"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-600"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md h-24 focus:ring focus:ring-blue-200 appearance-none transition duration-150"
          />
        </div>

        <div className="flex justify-between space-x-4">
          <div className="w-1/2">
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-gray-600"
            >
              Project Goal:
            </label>
            <input
              type="number"
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200 appearance-none transition duration-150"
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-600"
            >
              Currency:
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200 appearance-none transition duration-150"
            >
              <option value="ETH">Ethereum (ETH)</option>
              <option value="BTC">Bitcoin (BTC)</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-600"
          >
            Deadline:
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200 appearance-none transition duration-150"
          />
        </div>

        <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-600">Fundraiser Image:</label>
        <input 
            type="file" 
            id="image" 
            name="image" 
            onChange={handleImageChange}
            className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200 appearance-none transition duration-150 cursor-pointer"
        />
        {imagePreview && (
            <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="w-full h-64 rounded-md object-cover"/>
            </div>
        )}
    </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 transform transition hover:scale-105 active:bg-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
