import { Task } from './model.task.js';
import { Comment } from './model.comment.js';
import { mockTasksArray } from '../mock-ups/mock.tasks.js';

export class TaskCollection {
  taskArray = [];

  constructor(tasks) {
    if (Array.isArray(tasks)) {
      this.taskArray.push(...tasks);
    }
  }

  getTasks(skip = 0, top = 10, filterConfig = {}) {
    const filteredTasks = this.taskArray.filter((task) => {
      if (filterConfig.assignee && task.assignee !== filterConfig.assignee) {
        return false;
      }

      if (
        filterConfig.dateFrom &&
        Date.parse(filterConfig.dateFrom) > Date.parse(task.createdAt)
      ) {
        return false;
      }

      if (
        filterConfig.dateTo &&
        Date.parse(filterConfig.dateTo) + 24 * 60 * 60 * 1000 <
          Date.parse(task.createdAt)
      ) {
        return false;
      }

      if (filterConfig.status && filterConfig.status !== task.status) {
        return false;
      }

      if (filterConfig.priority && filterConfig.priority !== task.priority) {
        return false;
      }

      if (
        filterConfig.isPrivate !== undefined &&
        filterConfig.isPrivate !== task.isPrivate
      ) {
        return false;
      }

      if (
        filterConfig.description &&
        !task.description.includes(filterConfig.description) &&
        !task.name.includes(filterConfig.description)
      ) {
        return false;
      }
      return true;
    });

    this.sortTaskByDate(filteredTasks);

    let returnedArray = filteredTasks.slice(skip, top + skip);

    return returnedArray;
  }

  sortTaskByDate(filteredTasks) {
    return filteredTasks.sort(
      (a, b) => Date.parse(b.lastDate) - Date.parse(a.lastDate)
    );
  }

  getTask(id) {
    if (typeof id === 'string')
      return this.taskArray.find((elem) => elem.id === id);
  }

  add(name, priority, description, assignee, status, isPrivate = false) {
    const task = new Task(
      name,
      priority,
      description,
      assignee,
      status,
      isPrivate
    );
    if (Task.validate(task)) {
      this.taskArray.push(task);
      return true;
    }
    return false;
  }

  addAll(tasks) {
    const invalidTasks = [];
    tasks.forEach((task) => {
      if (Task.validate(task)) {
        this.taskArray.push(task);
      } else {
        invalidTasks.push(task);
      }
    });

    return invalidTasks;
  }

  clear() {
    this.taskArray = [];
  }

  edit(id, name, description, assignee, status, priority, isPrivate = false) {
    const task = this.getTask(id);

    if (!task) return false;

    if (name !== task.name && typeof name === 'string') {
      if (name.length > 100 || !name) return false;
      else task.name = name;
    }

    if (description !== task.description && typeof description === 'string') {
      if (description > 280) return false;
      else task.description = description;
    }

    if (assignee !== task.assignee && typeof assignee === 'string') {
      task.assignee = assignee;
    }
    if (status !== task.status && typeof status === 'string') {
      task.status = status;
      task.lastDate = new Date();
    }
    if (priority !== task.priority && typeof priority === 'string') {
      task.priority = priority;
    }
    if (isPrivate !== task.isPrivate && typeof isPrivate === 'boolean') {
      task.isPrivate = isPrivate;
    }
    return true;
  }

  editWhenChangUser(lastName, newName, avatar) {
    for (const task of this.taskArray) {
      if (task.assignee === lastName) task.assignee = newName;

      if (task._author.name === lastName) {
        task._author.name = newName;
        task._author.avatar = avatar;
      }

      for (const comment of task.comments) {
        if (comment._author === lastName) {
          comment._author.name = newName;
          comment._author.avatar = avatar;
        }
      }
    }
  }

  remove(id) {
    const task = this.getTask(id);

    const index = this.taskArray.indexOf(task);
    this.taskArray.splice(index, 1);

    return true;
  }

  saveInLocalStorage() {
    localStorage.setItem('taskArray', JSON.stringify(this.taskArray));
  }

  getFromLocalStorage() {
    let tasks = JSON.parse(localStorage.getItem('taskArray'));
    if (!tasks) {
      localStorage.setItem('taskArray', mockTasksArray());
      this.taskArray = JSON.parse(localStorage.getItem('taskArray'));
    } else {
      tasks = tasks.map((e) => {
        const task = Object.assign(new Task(), e);

        for (let i = 0; i < e.comments.length; i++) {
          task.comments[i] = Object.assign(new Comment(), e.comments[i]);
        }

        return task;
      });
      this.taskArray = [];
      this.addAll(tasks);
    }
  }
}
