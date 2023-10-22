pragma solidity ^0.8.17;
// License
// SPDX-License-Identifier: MIT

// buildConfig

contract DataContract {
    address public deployer; // deployer/owner of the contract
    string private cid; // either encrypted cid or customer encrypts data for security.
    bool public active; // if false, contract is inactive and no one can request access.
    uint256 public totalAccess; // total number of requests

    string private name;
    string private description;

    mapping(address => bool) public sismoVerified;
    bytes16 private sismoGroupId;

    // allowed address map
    mapping(address => bool) public allowedAddresses;

    bool private hasAllowedAddress = false;
    bytes16 private sismoAppId = 0xe2c8c9656f21297f674d82d714db2ce2;

    // general access
    mapping(address => bool) public hasAccess;

    constructor(
        string memory _cid,
        string memory _assertion,
        string memory _name,
        string memory _description,
        bytes16 _sismoGroupId
    ) {
        deployer = msg.sender;
        name = _name;
        description = _description;
        cid = _cid;
        active = true;
        totalAccess = 0;
        // sismoGroupId = 0x1cde61966decb8600dfd0749bd371f12;
        sismoGroupId = _sismoGroupId;
    }

    event AccessEvent(address indexed _buyer);
    event MessageReceived(
        string message,
        uint16 sourceChain,
        address sender,
        bool crossChainSet
    );

    struct ConditionResult {
        bool assertSuccess;
        bool crossChainSet;
        bool allowedAddress;
        bool sismoVerified;
    }

    function addAllowedAddress(address _address) public {
        require(msg.sender == deployer);
        allowedAddresses[_address] = true;
        hasAllowedAddress = true;
    }


    function requestAccess() public payable returns (string memory) {
        require(active, "Contract was marked inactive by creator");

        // check if bytes16 is null
        if (sismoGroupId != 0x00) {
            require(
                sismoVerified[msg.sender],
                "Address not verified by Sismo: Please call verifySismoConnectResponse successfully with your account"
            );
        }

        if (hasAllowedAddress) {
            require(
                allowedAddresses[msg.sender],
                "Address not allowed to access data"
            );
        }


        if (!hasAccess[msg.sender]) {
            emit AccessEvent(msg.sender);
            totalAccess += 1;
        }
        hasAccess[msg.sender] = true;
        return cid;
    }

    function getMetadata()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            address,
            uint256,
            address,
            bool,
            uint256,
            bytes16,
            ConditionResult memory
        )
    {
        ConditionResult memory conditionResult = ConditionResult(
            true,
            true,
            hasAllowedAddress ? allowedAddresses[msg.sender] : true,
            sismoVerified[msg.sender]
        );

        return (
            name,
            description,
            hasAccess[msg.sender] ? cid : "",
            "",
            msg.sender,
            0,
            deployer,
            active,
            totalAccess,
            sismoGroupId,
            conditionResult
        );
    }

    function toggleActive() public {
        require(msg.sender == deployer);
        active = !active;
    }
}
