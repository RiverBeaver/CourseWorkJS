import { setUser } from '../../index.js';

export class HeaderView {
  constructor(containerID) {
    this.containerID = containerID;
  }

  display(containerID, content) {
    const container = document.getElementById(`${containerID}`);
    container.querySelector('.userName').innerText = content[0];
    container.querySelector('.userLogo').innerHTML = '';
    container
      .querySelector('.userLogo')
      .insertAdjacentHTML('afterbegin', content[1]);
  }

  setCurrentUser(userObj) {
    setUser(userObj);
    this.display(this.containerID, this.getHTML(userObj));
  }

  getHTML(userObj) {
    return [userObj.name, `<img src="avatar/${userObj.avatar}.png">`];
  }
}

// let based = `
//     <rect x="0.1" y="0.1" width="39.8" height="39.8" rx="19.9"/>
//     <path fill-rule="evenodd" clip-rule="evenodd" d="M26.0002 16C26.0002 19.3137 23.314 22 20.0002 22C16.6865 22 14.0002 19.3137 14.0002 16C14.0002 12.6863 16.6865 10 20.0002 10C23.314 10 26.0002 12.6863 26.0002 16ZM24.0002 16C24.0002 18.2091 22.2094 20 20.0002 20C17.7911 20 16.0002 18.2091 16.0002 16C16.0002 13.7909 17.7911 12 20.0002 12C22.2094 12 24.0002 13.7909 24.0002 16Z"/>
//     <path d="M20.0002 25C13.5259 25 8.00952 28.8284 5.9082 34.192C6.4201 34.7004 6.95934 35.1812 7.52353 35.6321C9.08827 30.7077 13.997 27 20.0002 27C26.0035 27 30.9122 30.7077 32.477 35.6321C33.0412 35.1812 33.5804 34.7004 34.0923 34.1921C31.991 28.8284 26.4746 25 20.0002 25Z"/>
//     <rect x="0.1" y="0.1" width="39.8" height="39.8" rx="19.9"/>
// `
