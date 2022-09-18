import React from 'react'
import './AboutVlad.css'

const AboutVlad = () => {

  const discordInvite = "https://discord.com/oauth2/authorize?client_id=1013031057005740072&permissions=0&scope=bot%20applications.commands"

  return (
    <div className='av-div'>
      <h1 className='av-heading'>Meet Vlad !</h1>
      <div className='av-profile'>
        <img src="/assets/images/vlad.jpg" alt="vlad.jpg" className='av-avatar' />
        <p className='av-profile-text'>
          He is a friendly bot (although a bit scary!) who would regulate the event for you if you are an organizer.
        </p>
      </div>
      <div className='av-wv-div'>
        <h2 className='av-heading'>Why Vlad ?</h2>
        <p className='av-reg-text av-wv-text'>
          Flexipay is based on the idea of paying for an event only for the amount of time you attend it, not more or not less. But, if there are a large number of participants attending the event, it would be really frustrating for the event organizers to regulate the participants. It would require more human force and wouldn’t be something productive to be done by humans. Here, Vlad comes to the event organizers' rescue. Vlad would only allow the participants who have registered and their stream running, to attend the event and would kick out the remaining participants. Vlad would also prevent spamming during the events.
        </p>
      </div>
      <div className='av-uv-div'>
        <h2 className='av-heading'>How to set up and use Vlad ?</h2>
        <ul className='av-reg-text av-uv-ul'>
          <li>Copy the discord invite url for Vlad at the end of this page and paste it in your browser.</li>
          <li>Select the server to which you would like to add Vlad.</li>
          <li>Paste the following command in your #general channel.
              <br/>
              <code className='code-snippet'>{'!init eventInfo {eventId} {vc-name}'}</code>
          </li>
          <li>Replace <code className='code-snippet'>{'{eventId}'}</code> with the Event Id of your event and <code className='code-snippet'>{'{vc-name}'}</code> with the Voice Channel Name on which the event would be hosted.</li>
          <li>Before the event starts make sure to add the bot to the Voice channel by entering the command <code className='code-snippet'>/join</code> on your #general channel.</li>
          <li>After the event ends, you may remove the bot from the Voice channel by entering the command <code className='code-snippet'>/leave</code> on your #general channel.</li>
        </ul>
      </div>
      <div className='av-invite-div'>
        <h2 className='av-heading'>Invite Vlad to your server</h2>
        <div
          className="av-di-div"
          onClick={() => window.open(`${discordInvite}`)}
        >
          <img
            src="/assets/images/discord-logo.png"
            alt="discord-logo.png"
            className="av-discord-img"
          />
          <span className="av-di-text">Invite Vlad</span>
        </div>
      </div>
    </div>
  )
}

export default AboutVlad