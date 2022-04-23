// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Swapify {
    struct Swap {
        Status status; //[0]
        string description; // [1]
        address seller; //
        address buyer; // 0
        address[] swapTokens; //
        uint256[] swapTokenIds; //
        uint256 swapId; //
    }

    struct Offer {
        Status status;
        address buyer;
        address[] offerTokens;
        uint256[] offerTokenIds;
        uint256 swapId;
    }

    uint256 public swapCount;
    mapping(uint256 => Swap) public swaps;
    mapping(uint256 => Offer[]) public offers;
    mapping(uint256 => bool) public offerExists;
    mapping(address => Swap[]) public userSwaps; // contract.userSwaps(address)
    mapping(address => Offer[]) public userOffers;
    mapping(address => uint256) public userSwapCount;
    mapping(address => uint256) public userOffersCount;

    event SwapCreated(address seller, address[] tokens, uint256[] tokenIds);
    event OfferProposed(address buyer, address[] tokens, uint256[] tokenIds);
    event OfferRejected();
    event OfferCancelled(address buyer, uint256 swapId, uint256 offerId);
    event OfferAccepted(
        address seller,
        address[] swapTokens,
        uint256[] swapTokenIds,
        address buyer,
        address[] offerTokens,
        uint256[] offerTokenIds
    );

    enum Status {
        BLANK,
        CREATED,
        REJECTED,
        ACCEPTED,
        CANCELLED
    }

    modifier onlySeller(uint256 _swapId) {
        require(swaps[_swapId].seller == msg.sender, "Only Seller Allowed");
        _;
    }

    modifier onlyBuyer(uint256 _swapId, uint256 _offerId) {
        require(
            offers[_swapId][_offerId].buyer == msg.sender,
            "Only Buyer Allowed"
        );
        _;
    }

    modifier isApproved(address _tokenContract, uint256 _tokenId) {
        // add Approval
        require(
            IERC721(_tokenContract).getApproved(_tokenId) == address(this),
            "!approved"
        );
        _;
    }

    /**
     * @dev Initialize the contract settings, and owner to the deployer.
     */
    constructor() {}

    /**
     * @dev Creates a new order with status : `CREATED` and sets the escrow contract settings : token address and token id.
     * Can only be called is contract state is BLANK
     */
    function createSwap(
        address[] memory _swapTokens,
        uint256[] memory _swapTokenIds,
        string memory _description
    ) public {
        // checks lenghts
        require(_swapTokens.length == _swapTokenIds.length, "!length");

        // create swap
        uint256 swapId = swapCount;
        Swap memory swap_ = Swap(
            Status.CREATED, // [0]
            _description, // [1]
            msg.sender, //
            address(0), // 0
            _swapTokens, //
            _swapTokenIds, //
            swapId
        );
        // populate mappings/arrays
        swaps[swapId] = swap_;
        userSwaps[msg.sender].push(swap_);
        swapCount++;
        userSwapCount[msg.sender]++;

        emit SwapCreated(msg.sender, _swapTokens, _swapTokenIds);
    }

    function proposeOffer(
        uint256 _swapId,
        address[] memory _offerTokens,
        uint256[] memory _offerTokenIds
    ) public {
        // check lengths
        require(_offerTokens.length == _offerTokenIds.length, "!length");
        require(_swapId < swapCount, "Invalid _swapId");
        //create offer
        Offer memory offer_ = Offer(
            Status.CREATED,
            msg.sender,
            _offerTokens,
            _offerTokenIds,
            _swapId
        );

        offers[_swapId].push(offer_);
        userOffers[msg.sender].push(offer_);
        userOffersCount[msg.sender]++;
        offerExists[_swapId] = true;

        emit OfferProposed(msg.sender, _offerTokens, _offerTokenIds);
    }

    function cancelOffer(uint256 _swapId, uint256 _offerId)
        public
        onlyBuyer(_swapId, _offerId)
    {
        require(
            offers[_swapId][_offerId].status == Status.CREATED,
            "Can't Cancell now"
        );
        offers[_swapId][_offerId].status = Status.CANCELLED;
        emit OfferCancelled(msg.sender, _swapId, _offerId);
    }

    function updateOffer() public {}

    function acceptOffer(uint256 _swapId, uint256 _offerId)
        public
        onlySeller(_swapId)
    {
        require(
            offers[_swapId][_offerId].status == Status.CREATED,
            "Cant Accept now"
        );
        // addresses
        address seller = swaps[_swapId].seller;
        address buyer = offers[_swapId][_offerId].buyer;

        // swap seller token
        address[] memory swapTokens = swaps[_swapId].swapTokens;
        uint256[] memory swapTokenIds = swaps[_swapId].swapTokenIds;
        for (uint256 i = 0; i < swapTokens.length; i++) {
            IERC721(swapTokens[i]).safeTransferFrom(
                seller,
                buyer,
                swapTokenIds[i]
            );
        }

        // swap buyer token
        address[] memory offerTokens = offers[_swapId][_offerId].offerTokens;
        uint256[] memory offerTokenIds = offers[_swapId][_offerId]
            .offerTokenIds;
        for (uint256 i = 0; i < offerTokens.length; i++) {
            IERC721(offerTokens[i]).safeTransferFrom(
                buyer,
                seller,
                offerTokenIds[i]
            );
        }

        // update some mappings
        swaps[_swapId].status = Status.ACCEPTED;
        swaps[_swapId].buyer = buyer;
        offers[_swapId][_offerId].status = Status.ACCEPTED;

        // emit event
        emit OfferAccepted(
            seller,
            swapTokens,
            swapTokenIds,
            buyer,
            offerTokens,
            offerTokenIds
        );
    }

    function rejectOffer() public {}



    function getSwapToken(uint256 _swapId, uint256 _tokenNumber) public view returns(address token, uint256 tokenId, uint256 tokenNumbers) {
        token = swaps[_swapId].swapTokens[_tokenNumber];
        tokenId = swaps[_swapId].swapTokenIds[_tokenNumber];
        tokenNumbers = swaps[_swapId].swapTokens.length;
    }

    function getOfferToken(uint256 _swapId, uint256 _offerId, uint256 _tokenNumber) public view returns(address token, uint256 tokenId, uint256 tokenNumbers) {
        token = offers[_swapId][_offerId].offerTokens[_tokenNumber];
        tokenId = offers[_swapId][_offerId].offerTokenIds[_tokenNumber];
        tokenNumbers = offers[_swapId][_offerId].offerTokenIds.length;
    }
}
