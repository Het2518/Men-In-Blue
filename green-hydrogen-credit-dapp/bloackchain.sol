// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract GreenHydrogenCredit is ERC2771Context, ERC1155, AccessControl, ERC1155Supply {
    using MessageHashUtils for bytes32;
    using ECDSA for bytes32;

    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER_ROLE");

    uint256 private _tokenIdCounter;
    address public oracleSigner;

    event CreditIssued(address indexed producer, uint256 indexed tokenId, uint256 amount, string metadataURI);
    event CreditTransferred(address indexed from, address indexed to, uint256 indexed tokenId, uint256 amount);
    event CreditRetired(address indexed holder, uint256 indexed tokenId, uint256 amount);
    event SameNameFuncCalled(address indexed caller, uint256 timestamp);

    constructor(address trustedForwarder, address _oracleSigner)
        ERC2771Context(trustedForwarder)
        ERC1155("https://ipfs.io/ipfs/{id}.json")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(PRODUCER_ROLE, _msgSender());
        oracleSigner = _oracleSigner;
    }

    function issueCredit(
        address to,
        uint256 amount,
        string memory metadataURI
    ) public onlyRole(PRODUCER_ROLE) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        _mint(to, newTokenId, amount, "");
        _setURI(metadataURI);
        emit CreditIssued(to, newTokenId, amount, metadataURI);
    }

    function transferCredit(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) public {
        require(balanceOf(from, tokenId) >= amount, "Insufficient balance");
        safeTransferFrom(from, to, tokenId, amount, "");
        emit CreditTransferred(from, to, tokenId, amount);
    }

    function retireCredit(uint256 tokenId, uint256 amount) public {
        require(balanceOf(_msgSender(), tokenId) >= amount, "Not enough credits");
        _burn(_msgSender(), tokenId, amount);
        emit CreditRetired(_msgSender(), tokenId, amount);
    }

    function verifyOracleData(bytes32 msgHash, bytes memory oracleSig) public view returns (bool) {
        address signer = msgHash.toEthSignedMessageHash().recover(oracleSig);
        return signer == oracleSigner;
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function hasProducerRole(address account) public view returns (bool) {
        return hasRole(PRODUCER_ROLE, account);
    }

    function hasAuditorRole(address account) public view returns (bool) {
        return hasRole(AUDITOR_ROLE, account);
    }

    function hasConsumerRole(address account) public view returns (bool) {
        return hasRole(CONSUMER_ROLE, account);
    }

    function setMetadataURI(string memory newURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(newURI);
    }

    function sameNameFunc() public {
        emit SameNameFuncCalled(_msgSender(), block.timestamp);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC1155, AccessControl)
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}


    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, amounts);
    }

    // Override _msgSender and _msgData for ERC2771Context
    function _msgSender() internal view override(Context, ERC2771Context) returns (address sender) {
        sender = ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

    function _contextSuffixLength() internal view override(Context, ERC2771Context) returns (uint256) {
        return ERC2771Context._contextSuffixLength();
    }
}
