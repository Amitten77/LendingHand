// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.8;
 
//error codes
 
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
        // string description;
        // uint goal;
        // uint current;
        // bool reachedGoal;
        address[1000] donors;
        uint[1000] donations;
        uint numDonors;
    }
 
    event PostCreated(
        uint id,
        string name,
        // string description,
        // uint goal,
        // uint current,
        // address payable owner,
        bool reachedGoal,
        address[1000] donors,
        uint[1000] donations,
        uint numDonors
    );
 
    event PostDonated(
        uint id,
        // string name,
        // string description,
        // uint goal,
        // uint current,
        address payable owner,
        bool reachedGoal,
        address[1000] donors,
        uint[1000] donations,
        uint numDonors
    );
 
    constructor() public {
        name = "Lending Hand";
        owner = msg.sender;
    }
 
    function createPost(
        string memory _name,
        string memory _description,
        uint _goal
    ) public {
        //Make sure parameters are correct
        //Create the product
        require(bytes(_name).length > 0);
        require(bytes(_description).length > 0);
        require(_goal > 0);
 
        address[1000] memory _donors;
        uint[1000] memory _donations;
        //Increment Product Count
        postCount += 1;
        posts[postCount] = Post(
            postCount,
            _name,
            _description,
            _goal,
            0,
            msg.sender,
            false,
            _donors,
            _donations,
            0
        ); //msg.sender is person who called the function
        //Trigger an event (debugging purposes)
        emit PostCreated(
            postCount,
            _name,
            _description,
            _goal,
            0,
            msg.sender,
            false,
            _donors,
            _donations,
            0
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
        //Fetch the product
        Post memory _post = posts[_id];
        //Fetch the owner
        address payable _donee = _post.owner;
        //Make sure the product is valid
        require(_id > 0 && _id <= postCount);
        //Require that there is enough Ether in the transaction
        require(msg.value >= 0);
 
        require(!_post.reachedGoal);
 
        require(_donee != msg.sender);
 
        require(_post.numDonors < 1000);
 
        //update the post statistics
        _post.donors[_post.numDonors] = msg.sender;
        _post.donations[_post.numDonors] = msg.value;
 
        _post.numDonors += 1;
 
        _post.current += msg.value;
 
        if (_post.current >= _post.goal) {
            _post.reachedGoal = true;
        }
 
        // Update the product
        posts[_id] = _post;
        //Pay the seller sending them Ether
 
        _donee.transfer(msg.value);
        //Trigger an event
        emit PostDonated(
            _id,
            _post.name,
            _post.description,
            _post.goal,
            _post.current,
            _donee,
            _post.reachedGoal,
            _post.donors,
            _post.donations,
            _post.numDonors
        );
    }
}