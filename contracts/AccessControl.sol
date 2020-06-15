pragma solidity >=0.4.21 <0.6.0;

/** @title Access control contract
  * @notice This conract holds the implementation
  * logic of the role-based access control
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
        user.userLevel = "supervisor";
        user.role = "supervisor";
        user.organization = "supervisor 1";
        user.exists = 1;
    }

    /** @notice to make sure the caller user level is supervisor or the caller is owner of the contract
    */
    modifier onlySupervisor {
        require(msg.sender == owner || keccak256(abi.encodePacked(users[msg.sender].userLevel)) == keccak256(abi.encodePacked("supervisor")));
        _;
    }

    /** @notice to make sure the caller user level is organization master
    */
    modifier onlyOrganizationMaster {
        require(keccak256(abi.encodePacked(users[msg.sender].userLevel)) == keccak256(abi.encodePacked("organization master")));
        _;
    }

    /** @notice this function adds a new user
      * @param _address public address of the user
      * @param _userLevel userlevel of the user
      * @param _role role of the user
      * @param _organization organization of the user
      */
    function addUser(address _address, string memory _userLevel, string memory _role, string memory _organization) onlySupervisor public{
        AccessControl.User storage user = users[_address];
        require(user.exists == 0);
        user.userLevel = _userLevel;
        user.role = _role;
        user.organization = _organization;
        user.exists = 1;
    }

    /** @notice this function removes a user
      * @param _address public address of the user
      */
    function removeUser(address _address) onlySupervisor public {
        AccessControl.User storage user = users[_address];
        require(user.exists == 1);
        user.userLevel = "";
        user.role = "";
        user.organization = "";
        user.exists = 0;
    }

    /** @notice this function modifies a user's attributes
      * @param _address public address of the user
      * @param _userLevel user level of the user
      * @param _role role of the user
      * @param _organization organization of the user
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

    /** @notice this function checks the user level of the user who calls the function
      * @return user level of the caller
      */
    function checkUserLevel() view public returns(string memory){
         return (users[msg.sender].userLevel);
    }

    /** @notice this function checks the attributes of a user
      * @param _address public address of the user
      * @return does the user exist
      * @return user level of the user
      * @return role of the user
      * @return organization of the user
      */
    function checkUser(address _address) view onlySupervisor public returns(uint, string memory, string memory, string memory){
         return (users[_address].exists, users[_address].userLevel, users[_address].role, users[_address].organization);
    }

    /** @notice this function is used for checking the details of an organization
      * @param _organization the organization that is checked
      * @return does the organization exist
      * @return url of the organization
    */
    function checkOrganization(string memory _organization) view onlySupervisor public returns(string memory, string memory){
        if (organizations[_organization].exists == 0) {
            return ("does not exist", "");
        }
        return ("does exist", organizations[_organization].website);
    }

    /** @notice this function is used for getting the url of an organization
      * @param _organization the organization which url is requested
      * @return url of the organization
    */
    function getUrl(string memory _organization) view public returns(string memory){
        string memory url = organizations[_organization].website;
        return url;
    }

    /** @notice this function changes the url of an organization
      * @param _organization organization which url is changed
      * @param _url url of the organizations
    */
    function changeUrlOrganization(string memory _organization, string memory _url) onlySupervisor public{
        require(organizations[_organization].exists == 1);
        organizations[_organization].website = _url;
    }

    /** @notice this function adds a new organization
      * @param _organization name of the organization
      * @param _url url of the organization
    */
    function addOrganization(string memory _organization, string memory _url) onlySupervisor public{
        AccessControl.Organization storage organization = organizations[_organization];
        require(organization.exists == 0);
        organization.website = _url;
        organization.exists = 1;
    }

    /** @notice this function removes an organization
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

    /** @notice this function adds a new access right
      * @param _organization organization
      * @param _role role
      */
    function addAccessRight(string memory _organization, string memory _role) onlyOrganizationMaster public {
        string memory orgAndRole = string(abi.encodePacked(_organization, _role));
        AccessControl.Organization storage organization = organizations[users[msg.sender].organization];
        require(organization.exists == 1);
        require(organization.accessRights[orgAndRole].hasAccess == 0);
        organization.accessRights[orgAndRole].hasAccess = 1;
        organization.accessRightsArray.push(orgAndRole) -1;
    }

    /** @notice this function removes an access right
      * @param _organization organization
      * @param _role role
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

    /** @notice this function checks does a user have an access right
      * @param _organizationWhereConnecting organization where the access right is checked
      * @return does user have an access right or not
    */
    function checkAccess(string memory _organizationWhereConnecting) view public returns(string memory){
        AccessControl.User storage user = users[msg.sender];
        AccessControl.Organization storage targetOrganization = organizations[_organizationWhereConnecting];
        string memory orgAndRole = string(abi.encodePacked(user.organization, user.role));
        if (targetOrganization.accessRights[orgAndRole].hasAccess == 1) {
            return "Access given";
        }
        return "no access";
    }

    /** @notice this function checks an access right status in an organization
      * @param _organization organization
      * @param _role role
      * @return has access or not
    */
    function checkAccessRightOfRole(string memory _organization, string memory _role) view onlyOrganizationMaster public returns(string memory) {
        AccessControl.Organization storage organization = organizations[users[msg.sender].organization];
        string memory orgAndRole = string(abi.encodePacked(_organization, _role));
        if (organization.accessRights[orgAndRole].hasAccess == 1) {
            return "Access given";
        }
        return "No access";
    }

    /** @notice this function checks an access right status in an organization, used by supervisors
      * @param organizationWhereChecking organization where access right is checked
      * @param _organization organization
      * @param _role role
      * @return organization does not exist or if the organizations exists, has access or not
    */
    function checkAccessRightOfRoleSupervisors(string memory organizationWhereChecking, string memory _organization, string memory _role) view onlySupervisor public returns(string memory) {
        AccessControl.Organization storage organizationWhereCheckingAR = organizations[organizationWhereChecking];
        string memory orgAndRole = string(abi.encodePacked(_organization, _role));
        if (organizations[organizationWhereChecking].exists == 0) {
            return "Given organization does not exist";
        }
        if (organizationWhereCheckingAR.accessRights[orgAndRole].hasAccess == 1) {
            return "Access given";
        }
        return "No access";
    }
}