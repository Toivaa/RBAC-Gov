pragma solidity >=0.4.21 <0.6.0;

/** @title Query information smart contract
  * @notice the smart contract stores the information
  * of a performed query
  */
contract QueryInformation {
    string private query;
    string private organization;
    address private queryPerformer;

    struct Supervisor {
        uint hasAccess; // 0 no, 1 yes
    }

    mapping(address => Supervisor) supervisors;

    constructor(string memory _organization, string memory _query) public {
        query = _query;
        queryPerformer = msg.sender;
        organization = _organization;
        // add supervisors
        supervisors[0x86D1BaF7C16DBa6178AED253aF669e4421d6133F].hasAccess = 1;
        supervisors[0xfDb5Ec36d7245581E094e1053Dd91e72a3360729].hasAccess = 1;
        supervisors[0x46579A23307005B9E1e61D42064f93ba5C2F5683].hasAccess = 1;
        supervisors[0x7b90d9854FC1d06448Cb9EE899a2d2d5790A235f].hasAccess = 1;
    }

    /** @notice the modifier to make sure the msg.sender is a supervisor
    */
    modifier onlySupervisor () {
        require(supervisors[msg.sender].hasAccess == 1);
        _;
    }

    /** @notice the function checks the query details
      * @return organization
      * @return public address
      * @return query content
      */
    function checkQueryDetails() view onlySupervisor public returns(string memory, address, string memory) {
        return (organization, queryPerformer, query);
    }
}
