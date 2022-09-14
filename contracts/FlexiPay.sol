// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract FlexiPay {
    
    mapping(string => uint) eventLockingFee;
    mapping(string => uint) eventLockedFee;
    string[] public registeredEvents;

    function addEvent(string memory _eventId, uint256 _lockingFee) external {
        bytes memory _eventIdBytes = bytes(_eventId); 
        require(_eventIdBytes.length > 0, "Event id can't be null");
        require(_lockingFee > 0, "Event locking fee can't be zero");
        eventLockingFee[_eventId] = _lockingFee;
        registeredEvents.push(_eventId);
    }

    function registerForEvent(string memory _eventId) external payable {
        require(msg.value >= eventLockingFee[_eventId], "You should pay amount equal to locking fee");
        eventLockingFee[_eventId] += msg.value;
    }

    function getEventLockedFee(string memory _eventId) external view returns(uint256)  {
        return  eventLockedFee[_eventId];
    }
}