pragma solidity ^0.8.17;
// License
// SPDX-License-Identifier: MIT
import "@wormhole-solidity-sdk/src/interfaces/IWormholeRelayer.sol";
import "@wormhole-solidity-sdk/src/interfaces/IWormholeReceiver.sol";
// https://github.com/UMAprotocol/protocol/tree/master/packages/core
import "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";
import "@sismo-connect-solidity/src/SismoConnectLib.sol";

// buildConfig

// https://github.com/wormhole-foundation/wormhole-solidity-sdk
// https://remix.ethereum.org/#activate=solidity,fileManager&version=soljson-v0.8.16+commit.07a7930e.js&optimize=false&runs=200&gist=17a8a29b2f8ae432e8bac0b88cff8bb1&call=fileManager//open//gist-17a8a29b2f8ae432e8bac0b88cff8bb1/OOV3_GettingStarted.sol&lang=en&evmVersion=null
// https://github.com/UMAprotocol/protocol/blob/master/packages/core/networks/80001.json
contract DataContract is IWormholeReceiver, SismoConnect {
    address public deployer; // deployer/owner of the contract
    string private cid; // either encrypted cid or customer encrypts data for security.
    bool public active; // if false, contract is inactive and no one can request access.
    uint256 public totalAccess; // total number of requests

    IWormholeRelayer public wormholeRelayer;
    uint256 constant GAS_LIMIT = 50_000;

    string private name;
    string private description;

    mapping(bytes32 => bool) public seenDeliveryVaaHashes;

    OptimisticOracleV3Interface public oov3;
    address public umaAddress;
    // Asserted claim. This is some truth statement about the world and can be verified by the network of disputers.
    string private assertion;
    // ex: bytes public assertedClaim = bytes("Argentina won the 2022 Fifa world cup in Qatar");
    bytes private assertedClaim;
    bytes32 public assertionId;
    bool private assertionSuccess = false;

    // cross chain transaction
    address public crossChainAddress;
    uint256 public crossChainId;
    bool private crossChainSet = false;

    // sismo auth
    mapping(address => bool) public sismoVerified;
    bytes16 private sismoGroupId;

    // allowed address map
    mapping(address => bool) public allowedAddresses;

    function assertTruth() public {
        assertionId = oov3.assertTruthWithDefaults(
            assertedClaim,
            address(this)
        );
    }

    function settleAndGetAssertionResult() public returns (bool) {
        return oov3.settleAndGetAssertionResult(assertionId);
        // return assertionSuccess;
    }

    function getAssertionResult() public view returns (bool) {
        return oov3.getAssertionResult(assertionId);
    }

    function getAssertion()
        public
        view
        returns (OptimisticOracleV3Interface.Assertion memory)
    {
        return oov3.getAssertion(assertionId);
    }

    bool private hasAllowedAddress = false;
    bytes16 private sismoAppId = 0xe2c8c9656f21297f674d82d714db2ce2;

    // general access
    mapping(address => bool) public hasAccess;

    constructor(
        string memory _cid,
        string memory _assertion,
        string memory _name,
        string memory _description,
        address _crossChainAddress,
        uint256 _crossChainId,
        address _wormholeAddress,
        address _umaAddress,
        bytes16 _sismoGroupId
    ) SismoConnect(buildConfig(sismoAppId, true)) {
        deployer = msg.sender;
        name = _name;
        description = _description;
        assertion = _assertion;
        assertedClaim = bytes(_assertion);
        umaAddress = _umaAddress;
        crossChainAddress = _crossChainAddress;
        crossChainId = _crossChainId;
        cid = _cid;
        active = true;
        crossChainSet = false;
        totalAccess = 0;
        if (crossChainId != 0) {
            wormholeRelayer = IWormholeRelayer(_wormholeAddress);
        }
        if (assertedClaim.length != 0) {
            oov3 = OptimisticOracleV3Interface(_umaAddress);
        }
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

    // https://docs.sismo.io/sismo-docs/build-with-sismo-connect/getting-started-1
    function verifySismoConnectResponse(
        bytes memory response
    ) public returns (SismoConnectVerifiedResult memory) {
        ClaimRequest[] memory claims = new ClaimRequest[](1);
        claims[0] = buildClaim({groupId: sismoGroupId});
        // verify the response regarding our original request
        // otherwise throws error
        SismoConnectVerifiedResult memory result = verify({
            responseBytes: response,
            claims: claims
        });
        sismoVerified[msg.sender] = true;
        return result;
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

        // Check assertion if assertionClaim is nonempty
        if (assertedClaim.length != 0) {
            // https://docs.uma.xyz/developers/quick-start#settling-the-assertion
            require(
                getAssertionResult(),
                "Assertion is not true, cannot access data. Call assertTruth and settleAndGetAssertionResult to verify."
            );
        }

        // Check cross chain transaction has been set if chainId is nonzero
        if (crossChainId != 0) {
            require(
                crossChainSet,
                "Cross chain transaction requirement not met"
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
            assertionSuccess,
            crossChainSet,
            hasAllowedAddress ? allowedAddresses[msg.sender] : true,
            sismoVerified[msg.sender]
        );
        return (
            name,
            description,
            hasAccess[msg.sender] ? cid : "",
            assertion,
            crossChainAddress,
            crossChainId,
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

    function quoteCrossChainmessage(
        uint16 targetChain
    ) public view returns (uint256 cost) {
        (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            GAS_LIMIT
        );
    }

    function sendCrossChainmessage(
        uint16 targetChain,
        address targetAddress,
        string memory message
    ) public payable {
        uint256 cost = quoteCrossChainmessage(targetChain);
        require(msg.value == cost);
        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            abi.encode(message, msg.sender), // payload
            0, // no receiver value needed since we're just passing a message
            GAS_LIMIT
        );
    }

    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory, // additionalVaas
        bytes32, // address that called 'sendPayloadToEvm' (HelloWormhole contract address)
        uint16 sourceChain,
        bytes32 deliveryHash // this can be stored in a mapping deliveryHash => bool to prevent duplicate deliveries
    ) public payable override {
        require(msg.sender == address(wormholeRelayer), "Only relayer allowed");

        // Ensure no duplicate deliveries
        require(
            !seenDeliveryVaaHashes[deliveryHash],
            "Message already processed"
        );
        seenDeliveryVaaHashes[deliveryHash] = true;

        // Parse the payload and do the corresponding actions!
        (string memory message, address sender) = abi.decode(
            payload,
            (string, address)
        );

        // See if address and source match cross chain condition.
        if (crossChainAddress == sender && crossChainId == sourceChain) {
            crossChainSet = true;
        }

        emit MessageReceived(message, sourceChain, sender, crossChainSet);
    }
}
