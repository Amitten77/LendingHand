// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract LendingHand {
    uint public postCount = 0;
    mapping(uint => Post) public posts;
    string public name;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    struct Post {
        uint id;
        string name;
        string description;
        uint goal;
        uint current;
        address owner;
        bool reachedGoal;
        address[] donors;
        uint[] donations;
        uint numDonors;
    }

    event PostCreated(
        uint id,
        string name,
        string description,
        uint goal,
        address owner
    );

    event PostDonated(
        uint id,
        string name,
        uint donatedAmount,
        uint currentAmount,
        address donor,
        bool reachedGoal
    );

    constructor() {
        name = "Lending Hand";
        owner = msg.sender;
    }

    function createPost(
        string memory _name,
        string memory _description,
        uint _goal
    ) public {
        require(bytes(_name).length > 0, "Post name is required");
        require(bytes(_description).length > 0, "Post description is required");
        require(_goal > 0, "Goal must be greater than 0");

        postCount += 1;
        posts[postCount] = Post(
            postCount,
            _name,
            _description,
            _goal,
            0,
            msg.sender,
            false,
            new address[](0),
            new uint[](0),
            0
        );
        emit PostCreated(
            postCount,
            _name,
            _description,
            _goal,
            msg.sender
        );
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(
            amount <= address(this).balance,
            "Insufficient balance in the contract"
        );
        payable(owner).transfer(amount);
    }

    function donateToPost(uint _id) public payable {
        require(_id > 0 && _id <= postCount, "Invalid post ID");
        require(msg.value > 0, "Donation must be greater than 0");

        Post storage _post = posts[_id];

        require(!_post.reachedGoal, "The goal has already been reached");
        require(_post.owner != msg.sender, "Owner cannot donate to their own post");

        _post.donors.push(msg.sender);
        _post.donations.push(msg.value);
        _post.numDonors += 1;
        _post.current += msg.value;

        if (_post.current >= _post.goal) {
            _post.reachedGoal = true;
        }

        // This is a security-sensitive operation and should be handled with care in a production contract
        // wrap in an if check, decide the condition later
        payable(_post.owner).transfer(msg.value);

        emit PostDonated(
            _id,
            _post.name,
            msg.value,
            _post.current,
            msg.sender,
            _post.reachedGoal
        );
    }
}
