// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract FlexiPay {

    struct Attendee {
        string name;
        string username;
        address accountAddress;
    }

    mapping(string => Attendee[]) Attendees; 

    struct Event {
        string name;
        string date;
        string time;
        string about;
        uint256 rate; // rate is for per second 
        uint256 lockingFee;
        string cover;
        address organizer; // for initial demo we will be having only one organizer address 
        uint256 attendeeCount;
    }

    // Event[] public allEvents;
    mapping(string => Event) allEvents;
    string[] eventIds;

    function AddEvent(string memory _name,
                      string memory _date, 
                      string memory _time,
                      string memory _about,
                      uint256 _eventRate,
                      uint256 _lockingFee,
                      string memory _coverHash,
                      address _organizer,
                      string memory _eventId) external {
            allEvents[_eventId].name = _name;
            allEvents[_eventId].date = _date;
            allEvents[_eventId].time = _time;
            allEvents[_eventId].about = _about;
            allEvents[_eventId].rate = _eventRate;
            allEvents[_eventId].lockingFee = _lockingFee;
            allEvents[_eventId].cover = _coverHash;
            allEvents[_eventId].organizer = _organizer;
            eventIds.push(_eventId);
    }

    function getEvent(string memory _eventId) external view returns(Event memory) {
        return allEvents[_eventId];
    }

    function registerForEvent(string memory _eventId, string memory _name, string memory _username) external payable {
        require(msg.value >= allEvents[_eventId].lockingFee, "Locking fee is less than required");
        Attendees[_eventId].push(Attendee({name: _name, username: _username, accountAddress: msg.sender}));
        allEvents[_eventId].attendeeCount = allEvents[_eventId].attendeeCount + 1;
    }
}