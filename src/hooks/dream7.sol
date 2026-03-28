// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Dream7 — IPL Prediction Wall on Monad
/// @notice Binary YES/NO prediction markets with admin oracle resolution
/// @dev Deploy on Monad Testnet via Remix. Admin = deployer wallet.

contract Dream7 {

    // ─────────────────────────────────────────────
    //  DATA STRUCTURES
    // ─────────────────────────────────────────────

    struct Market {
        uint256 id;
        string  question;      // e.g. "Will CSK win today?"
        string  category;      // "IPL" | "CRICKET" | "CRYPTO" | "MEMES"
        uint256 deadline;      // unix timestamp — betting closes here
        uint256 yesPool;       // total MON staked on YES
        uint256 noPool;        // total MON staked on NO
        bool    resolved;      // has admin set the outcome?
        bool    outcomeYes;    // true = YES won
        uint256 minBet;        // minimum bet in wei
        uint256 maxBet;        // maximum bet in wei
        address creator;       // who created this market
    }

    // ─────────────────────────────────────────────
    //  STATE
    // ─────────────────────────────────────────────

    address public admin;
    uint256 public nextMarketId;

    mapping(uint256 => Market)                          public markets;
    mapping(uint256 => mapping(address => uint256))     public yesBets;
    mapping(uint256 => mapping(address => uint256))     public noBets;
    mapping(uint256 => mapping(address => bool))        public claimed;
    mapping(uint256 => mapping(address => bool))        public hasBet;

    // ─────────────────────────────────────────────
    //  EVENTS
    // ─────────────────────────────────────────────

    event MarketCreated(
        uint256 indexed id,
        string  question,
        string  category,
        uint256 deadline,
        uint256 minBet,
        uint256 maxBet
    );

    event BetPlaced(
        uint256 indexed marketId,
        address indexed user,
        bool    isYes,
        uint256 amount
    );

    event MarketResolved(
        uint256 indexed marketId,
        bool    outcomeYes
    );

    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount
    );

    // ─────────────────────────────────────────────
    //  MODIFIERS
    // ─────────────────────────────────────────────

    modifier onlyAdmin() {
        require(msg.sender == admin, "Dream7: admin only");
        _;
    }

    // ─────────────────────────────────────────────
    //  CONSTRUCTOR — seeds 3 IPL markets automatically
    // ─────────────────────────────────────────────

    constructor() {
        admin = msg.sender;

        // Seed markets so the UI looks alive immediately after deploy.
        // Deadlines are 6 hours from deploy — adjust as needed.
        uint256 t = block.timestamp;

        _createMarket(
            "Will CSK win their next IPL match?",
            "IPL",
            t + 6 hours,
            0.001 ether,
            1 ether
        );

        _createMarket(
            "Will total 6s in today's match be more than 10?",
            "IPL",
            t + 6 hours,
            0.001 ether,
            1 ether
        );

        _createMarket(
            "Will MON price be above $0.50 by end of today?",
            "CRYPTO",
            t + 6 hours,
            0.001 ether,
            1 ether
        );
    }

    // ─────────────────────────────────────────────
    //  INTERNAL HELPERS
    // ─────────────────────────────────────────────

    function _createMarket(
        string memory question,
        string memory category,
        uint256 deadline,
        uint256 minBet,
        uint256 maxBet
    ) internal returns (uint256 id) {
        id = nextMarketId++;
        markets[id] = Market({
            id:         id,
            question:   question,
            category:   category,
            deadline:   deadline,
            yesPool:    0,
            noPool:     0,
            resolved:   false,
            outcomeYes: false,
            minBet:     minBet,
            maxBet:     maxBet,
            creator:    msg.sender
        });
        emit MarketCreated(id, question, category, deadline, minBet, maxBet);
    }

    // ─────────────────────────────────────────────
    //  PUBLIC — createMarket (admin only for cleaner demo)
    // ─────────────────────────────────────────────

    /// @notice Create a new YES/NO market
    function createMarket(
        string calldata question,
        string calldata category,
        uint256 deadline,
        uint256 minBet,
        uint256 maxBet
    ) external onlyAdmin returns (uint256) {
        require(deadline > block.timestamp, "Dream7: deadline in past");
        require(minBet > 0 && maxBet >= minBet, "Dream7: invalid bet limits");
        return _createMarket(question, category, deadline, minBet, maxBet);
    }

    // ─────────────────────────────────────────────
    //  PUBLIC — betYes
    // ─────────────────────────────────────────────

    /// @notice Place a YES bet. Send MON as msg.value. One bet per user per market.
    function betYes(uint256 marketId) external payable {
        Market storage m = markets[marketId];
        require(block.timestamp < m.deadline, "Dream7: betting closed");
        require(!m.resolved,                  "Dream7: already resolved");
        require(!hasBet[marketId][msg.sender], "Dream7: already placed a bet");
        require(msg.value >= m.minBet,         "Dream7: bet too small");
        require(msg.value <= m.maxBet,         "Dream7: bet too large");

        hasBet[marketId][msg.sender] = true;
        yesBets[marketId][msg.sender] = msg.value;
        m.yesPool += msg.value;

        emit BetPlaced(marketId, msg.sender, true, msg.value);
    }

    // ─────────────────────────────────────────────
    //  PUBLIC — betNo
    // ─────────────────────────────────────────────

    /// @notice Place a NO bet. Send MON as msg.value. One bet per user per market.
    function betNo(uint256 marketId) external payable {
        Market storage m = markets[marketId];
        require(block.timestamp < m.deadline, "Dream7: betting closed");
        require(!m.resolved,                  "Dream7: already resolved");
        require(!hasBet[marketId][msg.sender], "Dream7: already placed a bet");
        require(msg.value >= m.minBet,         "Dream7: bet too small");
        require(msg.value <= m.maxBet,         "Dream7: bet too large");

        hasBet[marketId][msg.sender] = true;
        noBets[marketId][msg.sender] = msg.value;
        m.noPool += msg.value;

        emit BetPlaced(marketId, msg.sender, false, msg.value);
    }

    // ─────────────────────────────────────────────
    //  ADMIN — resolveMarket
    // ─────────────────────────────────────────────

    /// @notice Admin sets the final outcome. Can resolve before deadline.
    function resolveMarket(uint256 marketId, bool outcomeYes) external onlyAdmin {
        Market storage m = markets[marketId];
        require(!m.resolved, "Dream7: already resolved");

        m.resolved   = true;
        m.outcomeYes = outcomeYes;

        emit MarketResolved(marketId, outcomeYes);
    }

    // ─────────────────────────────────────────────
    //  PUBLIC — claim winnings
    // ─────────────────────────────────────────────

    /// @notice Winners call this to receive their proportional share of the pool.
    function claim(uint256 marketId) external {
        Market storage m = markets[marketId];
        require(m.resolved,                          "Dream7: not resolved yet");
        require(!claimed[marketId][msg.sender],       "Dream7: already claimed");

        uint256 userBet;
        uint256 winningPool;
        uint256 totalPool = m.yesPool + m.noPool;

        if (m.outcomeYes) {
            userBet     = yesBets[marketId][msg.sender];
            winningPool = m.yesPool;
        } else {
            userBet     = noBets[marketId][msg.sender];
            winningPool = m.noPool;
        }

        require(userBet > 0, "Dream7: no winning bet");

        claimed[marketId][msg.sender] = true;

        // Proportional payout: userBet / winningPool * totalPool
        uint256 payout = (userBet * totalPool) / winningPool;

        (bool ok, ) = msg.sender.call{value: payout}("");
        require(ok, "Dream7: transfer failed");

        emit WinningsClaimed(marketId, msg.sender, payout);
    }

    // ─────────────────────────────────────────────
    //  VIEW HELPERS (frontend convenience)
    // ─────────────────────────────────────────────

    /// @notice Returns all fields of a market
    function getMarket(uint256 marketId) external view returns (Market memory) {
        return markets[marketId];
    }

    /// @notice Returns a user's YES and NO bet amounts for a market
    function getUserBets(uint256 marketId, address user)
        external view
        returns (uint256 yesBet, uint256 noBet)
    {
        return (yesBets[marketId][user], noBets[marketId][user]);
    }

    /// @notice Returns YES and NO odds as basis points (10000 = 100%)
    /// e.g. yesOddsBps = 6200 means 62% YES
    function getOdds(uint256 marketId)
        external view
        returns (uint256 yesOddsBps, uint256 noOddsBps)
    {
        Market storage m = markets[marketId];
        uint256 total = m.yesPool + m.noPool;
        if (total == 0) return (5000, 5000); // 50/50 default
        yesOddsBps = (m.yesPool * 10000) / total;
        noOddsBps  = 10000 - yesOddsBps;
    }

    /// @notice Estimated payout if outcome is as specified (for UI preview)
    function estimatePayout(uint256 marketId, address user, bool forYes)
        external view
        returns (uint256)
    {
        Market storage m = markets[marketId];
        uint256 userBet     = forYes ? yesBets[marketId][user] : noBets[marketId][user];
        uint256 winningPool = forYes ? m.yesPool : m.noPool;
        uint256 totalPool   = m.yesPool + m.noPool;
        if (winningPool == 0 || userBet == 0) return 0;
        return (userBet * totalPool) / winningPool;
    }

    /// @notice Admin helper: change admin wallet
    function setAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Dream7: zero address");
        admin = newAdmin;
    }

    /// @notice Returns total number of markets created
    function totalMarkets() external view returns (uint256) {
        return nextMarketId;
    }

    // Allow contract to receive ETH directly (not needed but safe)
    receive() external payable {}
}
