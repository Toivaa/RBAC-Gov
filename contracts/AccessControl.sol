pragma solidity >=0.4.21 <0.6.0;

/** @title Access control smart contract
  * @notice the smart contract stores the information
  * of the role-based access control
  */
contract AccessControl {
    address private owner;
    mapping(string => Organization) organizations;
    mapping (address => User) users;

    struct AccessRight {
        uint hasAccess; // 0 no, 1 yes
    }

    struct Organization {
      string website;
      mapping(string => AccessRight) accessRights;
      string[] accessRightsArray;
      uint exists; //0 no, 1 yes
    }

    struct User {
        string userLevel;
        string role;
        string organization;
        uint exists; // 0 no, 1 yes
    }

    constructor() public {
        owner = msg.sender;
        AccessControl.User storage user = users[msg.sender];
        user.userLevel = "Supervisor";
        user.role = "Supervisor";
        user.organization = "Supervisor 1";
        user.exists = 1;
    }

    /** @notice the function modifier to make sure the msg.sender's user-level is "Supervisor" or the msg.sender is the owner of the contract
    */
    modifier onlySupervisor {
        require(msg.sender == owner || keccak256(abi.encodePacked(users[msg.sender].userLevel)) == keccak256(abi.encodePacked("Supervisor")));
        _;
    }

    /** @notice the function modifier to make sure the msg.sender's user-level is "Organization Master"
    */
    modifier onlyOrganizationMaster {
        require(keccak256(abi.encodePacked(users[msg.sender].userLevel)) == keccak256(abi.encodePacked("Organization Master")));
        _;
    }

    /** @notice the function adds a new user
      * @param _address the public address of the user
      * @param _userLevel the user-level of the user
      * @param _role the role of the user
      * @param _organization the organization of the user
      */
    function addUser(address _address, string memory _userLevel, string memory _role, string memory _organization) onlySupervisor public{
        AccessControl.User storage user = users[_address];
        require(user.exists == 0);
        user.userLevel = _userLevel;
        user.role = _role;
        user.organization = _organization;
        user.exists = 1;
    }

    /** @notice the function removes a user
      * @param _address the public address of the user
      */
    function removeUser(address _address) onlySupervisor public {
        AccessControl.User storage user = users[_address];
        require(user.exists == 1);
        user.userLevel = "";
        user.role = "";
        user.organization = "";
        user.exists = 0;
    }

    /** @notice the function modifies a user's attributes
      * @param _address the public address of the user
      * @param _userLevel the user-level of the user
      * @param _role the role of the user
      * @param _organization the organization of the user
      */
    function modifyUser(address _address, string memory _userLevel, string memory _role,  string memory _organization) onlySupervisor public {
        AccessControl.User storage user = users[_address];
        require(user.exists == 1);
        if (keccak256(abi.encodePacked(_role)) != keccak256(abi.encodePacked(""))) {
            user.role = _role;
        }
        if (keccak256(abi.encodePacked(_userLevel)) != keccak256(abi.encodePacked(""))) {
            user.userLevel = _userLevel;
        }
        if (keccak256(abi.encodePacked(_organization)) != keccak256(abi.encodePacked(""))) {
            user.organization = _organization;
        }
    }

    /** @notice the function checks the user-level of the user who calls the function
      * @return the user-level of the msg.sender
      */
    function checkUserLevel() view public returns(string memory){
         return (users[msg.sender].userLevel);
    }

    /** @notice the function checks the attributes of a user
      * @param _address the public address of the user
      * @return does the user exists
      * @return the user-level of the user
      * @return the role of the user
      * @return the organization of the user
      */
    function checkUser(address _address) view onlySupervisor public returns(uint, string memory, string memory, string memory){
         return (users[_address].exists, users[_address].userLevel, users[_address].role, users[_address].organization);
    }

    /** @notice the function is used for checking the details of an organization
      * @param _organization the organization that is checked
      * @return does the organization exists
      * @return the URL of the organization
    */
    function checkOrganization(string memory _organization) view onlySupervisor public returns(string memory, string memory){
        if (organizations[_organization].exists == 0) {
            return ("No", "");
        }
        return ("Yes", organizations[_organization].website);
    }

    /** @notice the function is used for getting the URL of an organization
      * @param _organization the organization which URL is requested
      * @return the URL of the organization
    */
    function getUrl(string memory _organization) view public returns(string memory){
        string memory url = organizations[_organization].website;
        return url;
    }

    /** @notice the function changes the URL of an organization
      * @param _organization the organization which URL is changed
      * @param _url the URL of the organization
    */
    function changeUrlOrganization(string memory _organization, string memory _url) onlySupervisor public{
        require(organizations[_organization].exists == 1);
        organizations[_organization].website = _url;
    }

    /** @notice the function adds a new organization
      * @param _organization the name of the organization
      * @param _url the URL of the organization
    */
    function addOrganization(string memory _organization, string memory _url) onlySupervisor public{
        AccessControl.Organization storage organization = organizations[_organization];
        require(organization.exists == 0);
        organization.website = _url;
        organization.exists = 1;
    }

    /** @notice the function removes an organization
      * @param _organization the organization that is removed
      */
    function removeOrganization(string memory _organization) onlySupervisor public{
        AccessControl.Organization storage organization = organizations[_organization];
        require(organization.exists == 1);
        organization.website = "";
        organization.exists = 0;
        // need to get rid of all the mappings
        for (uint i = 0; i < organization.accessRightsArray.length; i++) {
            organization.accessRights[organization.accessRightsArray[i]].hasAccess = 0;
        }
        organization.accessRightsArray.length = 0; // clear the array
    }

    /** @notice the function adds a new access right
      * @param _organization the organization
      * @param _role the role
      */
    function addAccessRight(string memory _organization, string memory _role) onlyOrganizationMaster public {
        string memory orgAndRole = string(abi.encodePacked(_organization, _role));
        AccessControl.Organization storage organization = organizations[users[msg.sender].organization];
        require(organization.exists == 1);
        require(organization.accessRights[orgAndRole].hasAccess == 0);
        organization.accessRights[orgAndRole].hasAccess = 1;
        organization.accessRightsArray.push(orgAndRole) -1;
    }

    /** @notice the function removes an access right
      * @param _organization the organization
      * @param _role the role
      */
    function removeAccessRight(string memory _organization, string memory _role) onlyOrganizationMaster public{
        string memory orgAndRole = string(abi.encodePacked(_organization, _role));
        AccessControl.Organization storage organization = organizations[users[msg.sender].organization];
        require(organization.exists == 1);
        require(organization.accessRights[orgAndRole].hasAccess == 1);
        organization.accessRights[orgAndRole].hasAccess = 0;
        for (uint i = 0; i < organization.accessRightsArray.length; i++) {
            if (keccak256(abi.encodePacked(organization.accessRightsArray[i])) == keccak256(abi.encodePacked(orgAndRole))) {
                organization.accessRightsArray[i] = organization.accessRightsArray[organization.accessRightsArray.length - 1];
                organization.accessRightsArray.length--;
            }
        }
    }

    /** @notice the function is used for checking is the msg.sender able to access the given organization's database
      * @param _organizationWhereConnecting the organization where the access right is checked
      * @return can the user access the database or not
    */
    function checkAccess(string memory _organizationWhereConnecting) view public returns(string memory){
        AccessControl.User storage user = users[msg.sender];
        AccessControl.Organization storage targetOrganization = organizations[_organizationWhereConnecting];
        string memory orgAndRole = string(abi.encodePacked(user.organization, user.role));
        if (targetOrganization.accessRights[orgAndRole].hasAccess == 1) {
            return "Access given";
        }
        return "No access";
    }

    /** @notice the function checks can the role access an organization's database, and is used by the users that have the user-level “Organization Master"
      * @param _organization the organization
      * @param _role the role
      * @return can access or not
    */
    function checkAccessRight(string memory _organization, string memory _role) view onlyOrganizationMaster public returns(string memory) {
        AccessControl.Organization storage organization = organizations[users[msg.sender].organization];
        string memory orgAndRole = string(abi.encodePacked(_organization, _role));
        if (organization.accessRights[orgAndRole].hasAccess == 1) {
            return "Access given";
        }
        return "No access";
    }

    /** @notice the function checks can the role access an organization's database, and is used by the users that have the user-level “Supervisor"
      * @param organizationWhereChecking the organization where the access right is checked
      * @param _organization the organization
      * @param _role the role
      * @return no such organization or if the organization exists can access or not
    */
    function checkAccessRightSupervisor(string memory organizationWhereChecking, string memory _organization, string memory _role) view onlySupervisor public returns(string memory) {
        AccessControl.Organization storage organizationWhereCheckingAR = organizations[organizationWhereChecking];
        string memory orgAndRole = string(abi.encodePacked(_organization, _role));
        if (organizations[organizationWhereChecking].exists == 0) {
            return "No such organization";
        }
        if (organizationWhereCheckingAR.accessRights[orgAndRole].hasAccess == 1) {
            return "Access given";
        }
        return "No access";
    }
}