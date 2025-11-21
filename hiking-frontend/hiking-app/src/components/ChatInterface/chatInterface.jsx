import React from 'react';
import './chatInterface.scss';
import avatarImage from '../../assets/images/avatar.jpg';
import sendMessageIcon from '../../assets/images/message.webp';
import settingsIcon from '../../assets/images/settings.png';

function ChatInterface() {
  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Groups</h2>
      </div>
      <div className="chat-container">
        <div className="user-list-container">
          <div className="profile-area">
            <img src={avatarImage} alt="Profile" className="profile-image" />
            <div className="profile-username">Altin Daka</div>
          </div>
          <div className="search-input">
            <input type="text" placeholder="Search group names..." />
          </div>
          <h3 style={{ color: 'white' }}>Chats</h3>
          <div className="chat-user">
            <img src={avatarImage} alt="Group Avatar" className="chat-avatar" />
            <div className="user-info">
              <span className="chat-username">Work</span>
              <span className="last-active">Active now</span>
            </div>
          </div>
          <div className="chat-user">
            <img src={avatarImage} alt="Group Avatar" className="chat-avatar" />
            <div className="user-info">
              <span className="chat-username">Friends</span>
              <span className="last-active">Active now</span>
            </div>
          </div>
          <div className="chat-user">
            <img src={avatarImage} alt="Group Avatar" className="chat-avatar" />
            <div className="user-info">
              <span className="chat-username">Family</span>
              <span className="last-active">Active now</span>
            </div>
          </div>
          <div className="chat-user">
            <img src={avatarImage} alt="Group Avatar" className="chat-avatar" />
            <div className="user-info">
              <span className="chat-username">Study Group</span>
              <span className="last-active">Active now</span>
            </div>
          </div>
          
          <div className="settings-container">
            <span className="settings-text">Settings</span>
            <img src={settingsIcon} alt="Settings" className="settings-icon" />
          </div>
        </div>
        <div className="chats">
          <div className="chat-messages-container">
            <div className="group-name">Group Name</div>
            <div className="chat-messages">
              <div className="chat-message user">User message</div>
              <div className="chat-message other">Other user message</div>
            </div>
          </div>
          <div className="chat-input-container">
            <input type="text" placeholder="Type your message..." className="chat-input" />
            <button className="send-message-button">
              <img src={sendMessageIcon} alt="Send Message" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
