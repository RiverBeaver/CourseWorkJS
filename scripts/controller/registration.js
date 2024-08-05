import { crutchLogin } from '../../script.js';
import { userDB } from '../../index.js';
import { popUp } from '../helpers/popUp.js';

export function registration() {
  const regForm = document.querySelector('form[name="registration"]');
  const regFormButton = regForm.querySelector('button');

  regFormButton.addEventListener('click', () => {
    let regData = {
      name: regForm[0].value,
      login: regForm[1].value,
      password: regForm[2].value,
      repeatPassword: regForm[3].value,
    };

    const existCheck = !!userDB.userArray.find((element) => {
      return regData.login === element.login;
    });
    if (
      regData.login === '' ||
      regData.password === '' ||
      regData.repeatPassword === '' ||
      regData.name === ''
    ) {
      return popUp('Fill in the fields');
    }

    if (existCheck) {
      popUp('Email already used');
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(regData.login)
    ) {
      popUp('The email was entered incorrectly');
      return;
    } else {
      if (
        regData.password === regData.repeatPassword &&
        regData.password.length >= 6
      ) {
        if (userDB.create(regData.login, regData.password, regData.name)) {
          userDB.saveCurrentUserInLocalStorage(userDB.userArray.at(-1));
          userDB.saveUserArrayInLocalStorage();
          crutchLogin();
        } else popUp(`User with this email already exist.`);
      } else if (regData.password !== regData.repeatPassword) {
        popUp(
          `The password and the confirmation of the password do not match. Try again`
        );
      } else if (regData.password.length < 6) {
        popUp(`The password must be at least 6 characters long`);
      }
    }
  });
}
