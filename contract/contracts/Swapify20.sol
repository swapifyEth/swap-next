// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/** @title Swapify20
 *  @dev This contract implement multiple ERC721 and ERC20 tokens swap mechanism.
 * PROCESS:
 *          - User can put some of their ERC721 tokens on offers by approving the contract to spend them.
 *          - Users can make offers for exisiting swaps by approving the contract to spend their ERC20/ERC721 tokens.
 *          - Once offer is accepted the swap happen. 
 */

contract Swapify20 {

    /**
     * @dev Struct holding swap data.
     * @param status: indicating swap status e.g OPEN, CANCELLED ..
     * @param description: string describing the swap e.g `Looking for Azuki`.
     * @param seller: address of person creating swap.
     * @param buyer: address of buyer when swap is settled, address(0) otherwise
     * @param swapTokens: array of tokens to swap.
     * @param swapId: Id of the swap
     */
    struct Swap {
        Status status;
        string description;
        address seller;
        address buyer;
        address[] swapTokens;
        uint256[] swapTokenIds;
        uint256 swapId; //
    }

    /**
     * @dev Struct holding offer data.
     * @param status: indicating offer status e.g ACCEPTED, REJECTED ..
     * @param buyer: address of person creating offer.
     * @param offerTokens: array of tokens to swap.
     * @param swapId: Id of the swap attached to the offer
     */
    struct Offer {
        Status status;
        address buyer;
        address[] offerTokens;
        uint256[] offerTokenIds;
        address[] offerERC20s;
        uint256[] amounts;
        uint256 swapId;
    }

    uint256 public swapCount;
    mapping(uint256 => Swap) public swaps;
    mapping(uint256 => Offer[]) public offers;
    mapping(address => Swap[]) public userSwaps; // contract.userSwaps(address)
    mapping(address => Offer[]) public userOffers;
    mapping(address => uint256) public userSwapCount;
    mapping(address => uint256) public userOffersCount;

    event SwapCreated(address seller, address[] tokens, uint256[] tokenIds);
    event OfferProposed(
        address buyer,
        address[] tokens,
        uint256[] tokenIds,
        address[] offerERC20,
        uint256[] amounts
    );
    event OfferRejected();
    event OfferCancelled(address buyer, uint256 swapId, uint256 offerId);
    event OfferAccepted(
        address seller,
        address[] swapTokens,
        uint256[] swapTokenIds,
        address buyer,
        address[] offerTokens,
        uint256[] offerTokenIds,
        address[] offerERC20,
        uint256[] amounts
    );

    enum Status {
        BLANK,
        CREATED,
        REJECTED,
        ACCEPTED,
        CANCELLED
    }

    /**
     * @dev Throws if caller is not the seller of the swapId
     */
    modifier onlySeller(uint256 _swapId) {
        require(swaps[_swapId].seller == msg.sender, "Only Seller Allowed");
        _;
    }

     /**
     * @dev Throws if caller is not the buyer of the swapId
     */
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
     * @dev Creates a new swap with status : `CREATED`.
     * @notice user need to approve the contract to spend his tokens before calling
     */
    function createSwap(
        address[] memory _swapTokens,
        uint256[] memory _swapTokenIds,
        string memory _description
    ) public {
        // checks lenghts
        require(_swapTokens.length == _swapTokenIds.length, "!length");
        require(_swapTokens.length != 0, "0length");

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


     /**
     * @dev Creates a new offer with status : `CREATED`.
     * @notice user need to approve the contract to spend his tokens before calling
     */
    function proposeOffer(
        uint256 _swapId,
        address[] memory _offerTokens,
        uint256[] memory _offerTokenIds,
        address[] memory _ERC20s,
        uint256[] memory _amounts
    ) public {
        // check lengths
        require(_offerTokens.length == _offerTokenIds.length, "!length tokens");
        require(_ERC20s.length == _amounts.length, "!length ERC20");
        require(_offerTokens.length != 0 || _ERC20s.length != 0, "0 lengths");
        //create offer
        Offer memory offer_ = Offer(
            Status.CREATED,
            msg.sender,
            _offerTokens,
            _offerTokenIds,
            _ERC20s,
            _amounts,
            _swapId
        );

        userOffersCount[msg.sender]++;
        offers[_swapId].push(offer_);
        userOffers[msg.sender].push(offer_);

        emit OfferProposed(
            msg.sender,
            _offerTokens,
            _offerTokenIds,
            _ERC20s,
            _amounts
        );
    }


    /**
     * @dev Cancells an offer with status 
     * Only Buyer can call it
     */
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




    /**
     * @dev Accept swap and make transfers
     * Only seller can call it
     */
    function acceptOffer(uint256 _swapId, uint256 _offerId)
        public
        onlySeller(_swapId)
    {
        require(
            offers[_swapId][_offerId].status == Status.CREATED,
            "Can't Accept now"
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
        if (offerTokens.length != 0) {
            for (uint256 i = 0; i < offerTokens.length; i++) {
                IERC721(offerTokens[i]).safeTransferFrom(
                    buyer,
                    seller,
                    offerTokenIds[i]
                );
            }
        }
        // swap buyer erc20
        address[] memory offerERC20s = offers[_swapId][_offerId].offerERC20s;
        uint256[] memory amounts = offers[_swapId][_offerId].amounts;
        if (offerERC20s.length != 0) {
            for (uint256 i = 0; i < offerERC20s.length; i++) {
                IERC20(offerERC20s[i]).transferFrom(buyer, seller, amounts[i]);
            }
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
            offerTokenIds,
            offerERC20s,
            amounts
        );
    }

}
