import React from "react";

const About = () => {
  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white shadow-xl rounded-xl">
      <h2 className="text-4xl font-semibold text-blue-800 text-center">
        About Us
      </h2>
      <p className="text-xl text-gray-700 mt-6">
        Welcome to <span className="font-bold">Lending Hand</span>! We are a
        team passionate about connecting Web3 projects with Donors to further
        progress the evolution of Web3.
      </p>
      <p className="text-xl text-gray-700 mt-6">
        <span className="font-bold">How it Works:</span> Users first connect
        their Metamask account. Account Info can be seen at the top. Then,
        people can scroll through the posts and donate how much ever they want
        to specific posts.
      </p>
    </div>
  );
};

export default About;
