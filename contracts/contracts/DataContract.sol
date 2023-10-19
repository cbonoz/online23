pragma solidity ^0.8.16;
// License
// SPDX-License-Identifier: MIT
import "@wormhole-solidity-sdk/src/interfaces/IWormholeRelayer.sol";
import "@wormhole-solidity-sdk/src/interfaces/IWormholeReceiver.sol";

// import "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";

// https://github.com/wormhole-foundation/wormhole-solidity-sdk
// https://remix.ethereum.org/#activate=solidity,fileManager&version=soljson-v0.8.16+commit.07a7930e.js&optimize=false&runs=200&gist=17a8a29b2f8ae432e8bac0b88cff8bb1&call=fileManager//open//gist-17a8a29b2f8ae432e8bac0b88cff8bb1/OOV3_GettingStarted.sol&lang=en&evmVersion=null
// https://github.com/UMAprotocol/protocol/blob/master/packages/core/networks/80001.json
contract DataContract is IWormholeReceiver {
    address public deployer; // deployer/owner of the contract
    string private cid; // either encrypted cid or customer encrypts data for security.
    bool public active; // if false, contract is inactive and no one can request access.
    uint256 public totalAccess; // total number of requests

    IWormholeRelayer public immutable wormholeRelayer;
    uint256 constant GAS_LIMIT = 50_000;
    string public latestmessage;

    address public umaAddress;

    string private name;
    string private description;

    mapping(bytes32 => bool) public seenDeliveryVaaHashes;
    mapping(address => bool) public seenMessages;
    // OptimisticOracleV3Interface oov3 = OptimisticOracleV3Interface(0x9923D42eF695B5dd9911D05Ac944d4cAca3c4EAB);

    // Asserted claim. This is some truth statement about the world and can be verified by the network of disputers.
    // bytes public assertedClaim = bytes("Argentina won the 2022 Fifa world cup in Qatar");
    string private assertion;
    bytes private assertedClaim;
    bytes32 public assertionId;

    address public crossChainAddress;
    uint256 public crossChainChainId;

    bool private crossChainSet;


    // function assertTruth() public {
    //     assertionId = oov3.assertTruthWithDefaults(
    //         assertedClaim,
    //         address(this)
    //     );
    // }

    // function settleAndGetAssertionResult() public returns (bool) {
    //     return oov3.settleAndGetAssertionResult(assertionId);
    // }

    // function getAssertionResult() public view returns (bool) {
    //     return oov3.getAssertionResult(assertionId);
    // }

    // function getAssertion()
    //     public
    //     view
    //     returns (OptimisticOracleV3Interface.Assertion memory)
    // {
    //     return oov3.getAssertion(assertionId);
    // }

    mapping(address => bool) public hasAccess;

    constructor(
        string memory _cid,
        string memory _assertion,
        string memory _name,
        string memory _description,
        address _wormholeRelayer,
        address _umaAddress
    ) {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        deployer = msg.sender;
        name = _name;
        description = _description;
        assertion = _assertion;
        assertedClaim = bytes(_assertion);
        umaAddress = _umaAddress;
        cid = _cid;
        active = true;
        crossChainSet = false;
        totalAccess = 0;
    }

    event AccessEvent(address indexed _buyer);
    event MessageReceived(string message, uint16 sourceChain, address sender);

    function requestAccess() public payable returns (string memory) {
        require(active, "Contract was marked inactive by creator");

        // Check assertion if assertionClaim is nonempty
        if (assertedClaim.length != 0) {
        }


        // Check cross chain transaction has been set if chainId is nonzero
        if (crossChainChainId != 0) {
            require(crossChainSet, "Cross chain transaction requirement not met");
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
            uint256
        )
    {
        return (
            name,
            description,
            hasAccess[msg.sender] ? cid : "",
            assertion,
            crossChainAddress,
            crossChainChainId,
            deployer,
            active,
            totalAccess
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
        emit MessageReceived(message, sourceChain, sender);
    }
}
