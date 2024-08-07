import { userDB, view } from '../../index.js';
import { getUserSelects } from '../controller/taskCreate.js';

export class TaskPage {
  constructor(containerID) {
    this.containerID = containerID;
  }

  display(containerID, content) {
    const container = document.getElementById(`${containerID}`);
    container.prepend(content);

    // container.insertAdjacentHTML('afterbegin', content);
  }

  showTaskPage(task) {
    this.display(this.containerID, this.returnPageHTML(task));
    this.setCurrentImportance(task);
    this.setCurrentPrivate(task);
  }

  returnPageHTML(task) {
    const pageHTML = view.get('taskPage');

    pageHTML.querySelector('.assignTo select').innerHTML = getUserSelects(
      task.assignee
    );
    pageHTML.querySelector('.title input').value = task.name;
    pageHTML.querySelector('.description textarea').value = task.description;
    pageHTML.querySelector('.boardName').value = task.status;

    const comments = this.returnComments(task);
    for (let i = comments.length - 1; i >= 0; i--) {
      pageHTML.querySelector('.commentSection').append(comments[i]);
    }

    return pageHTML;
  }

  returnComments(task) {
    return task.comments.map((comment) => this.returnCommentHTML(comment));
  }

  returnCommentHTML(comment) {
    const commentHTML = view.get('comment');
    commentHTML.querySelector(
      '.avatarPlaceholder'
    ).innerHTML = `<image href="avatar/${this.getAuthorAvatar(
      comment._author.login
    )}.png" width="100%"></image>`;
    commentHTML.querySelector('p').innerText = comment.text;
    commentHTML.querySelector('.date').innerHTML =
      `${comment._author.name.italics()} ` + this._getDateCreatComment(comment);

    return commentHTML;
  }

  getAuthorAvatar(commentAuthor) {
    return userDB.getUserByLogin(commentAuthor).avatar;
  }

  _getDateCreatComment(comment) {
    const date = new Date(Date.parse(comment.createdAt));
    const currentDate = new Date();
    const difference = Math.floor((currentDate - date) / 1000);

    if (Math.floor(difference / 60) === 0) {
      return `${difference} seconds ago`;
    } else if (Math.floor(difference / (60 * 60)) === 0) {
      return `${Math.floor(difference / 60)} minutes ago`;
    } else if (Math.floor(difference / (60 * 60 * 24)) === 0) {
      return `${Math.floor(difference / (60 * 24))} hours ago`;
    } else {
      const year = date.getFullYear();
      const month = this._getMonth(date.getMonth());
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();

      return `${day} ${month}, ${year} at ${hours}:${minutes}`;
    }
  }

  _getMonth(month) {
    switch (month) {
      case 0:
        return 'January';
      case 1:
        return 'February';
      case 2:
        return 'March';
      case 3:
        return 'April';
      case 4:
        return 'May';
      case 5:
        return 'June';
      case 6:
        return 'July';
      case 7:
        return 'August';
      case 8:
        return 'September';
      case 9:
        return 'October';
      case 10:
        return 'November';
      case 11:
        return 'December';
    }
  }

  setCurrentImportance(task) {
    const currentImportance = task.priority;
    const importances = document.querySelectorAll('#importance input');
    importances.forEach((e) => {
      if (e.value === currentImportance) e.checked = true;
    });
  }

  setCurrentPrivate(task) {
    const currentAccess = task.isPrivate;
    const access = document.querySelectorAll('.chooseAccess input');

    if (currentAccess) access[1].checked = true;
    else access[0].checked = true;
  }
}
