// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract fDaiXToken {
    function transfer(address from, uint256 amount) public {}
    function balanceOf(address account) public view virtual returns (uint256) {}
}

contract FlexiPay {

    struct AttendeeInfo {
        bool isWithDrawn;
        bool isRsvpPaid;
    }

    fDaiXToken fDaiXContract;
    mapping(string => uint) eventLockingFee;
    mapping(string => uint) eventLockedFee;
    string[] public registeredEvents;
    address fDAIxTokenOnMumbaiTestnetAddress = 0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f;
    mapping(bytes => AttendeeInfo) eventAttendee;

    constructor() {
        fDaiXContract = fDaiXToken(fDAIxTokenOnMumbaiTestnetAddress);
    }

    function addEvent(string memory _eventId, uint256 _lockingFee) external {
        bytes memory _eventIdBytes = bytes(_eventId); 
        require(_eventIdBytes.length > 0, "Event id can't be null");
        require(_lockingFee > 0, "Event locking fee can't be zero");
        eventLockingFee[_eventId] = _lockingFee;
        registeredEvents.push(_eventId);
    }

    function registerForEvent(string memory _eventId, uint256 tokens) external {
        require(tokens >= eventLockingFee[_eventId], "You should pay amount equal to locking fee");
        bytes memory _eventAttendeeId = bytes.concat(bytes(abi.encodePacked(msg.sender)), " ", bytes(_eventId));
        eventAttendee[_eventAttendeeId].isWithDrawn = false;
        eventAttendee[_eventAttendeeId].isRsvpPaid = true;
        eventLockedFee[_eventId] += tokens;
    }

    function getEventLockedFee(string memory _eventId) external view returns(uint256)  {
        return eventLockedFee[_eventId];
    }

    function withDrawRsvpFee(string memory _eventId) external {
        bytes memory _eventAttendeeId = bytes.concat(bytes(abi.encodePacked(msg.sender)), " ", bytes(_eventId));
        require(eventLockedFee[_eventId] >= eventLockingFee[_eventId], "No fee remains to claim");
        require(eventAttendee[_eventAttendeeId].isWithDrawn == false, "You had already withdrawn fee");
        eventAttendee[_eventAttendeeId].isWithDrawn = true;
        eventAttendee[_eventAttendeeId].isRsvpPaid = false;
        eventLockedFee[_eventId] -= eventLockingFee[_eventId];
        fDaiXContract.transfer(msg.sender, eventLockingFee[_eventId] * 1 ether);
    }

    function isRsvpFeeWithDrawn(string memory _eventId) external view returns (bool) {
        bytes memory _eventAttendeeId = bytes.concat(bytes(abi.encodePacked(msg.sender)), " ", bytes(_eventId));
        return eventAttendee[_eventAttendeeId].isWithDrawn;
    }
}