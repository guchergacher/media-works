'use strict';

const buttonUserLogin = document.querySelector('.nav__link--user');
const modal = document.querySelector('.modal');
const modalForm = modal.querySelector('.modal-form');
const buttonCloseModal = modal.querySelector('.modal__button');

const closeModal = function () {
  document.body.classList.remove('modal-show');
  modal.classList.remove('modal--show');
};

buttonUserLogin.addEventListener('click', function (evt) {
  evt.preventDefault();
  modalForm.reset();

  const focusField = modal.querySelector('.form-input__field[type="email"]');

  document.body.classList.add('modal-show');
  modal.classList.add('modal--show');

  focusField.focus();
});

buttonCloseModal.addEventListener('click', function (evt) {
  evt.preventDefault();
  closeModal();
});

window.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {

    if (modal.classList.contains('modal--show')) {
      evt.preventDefault();
      closeModal();
    }

  }
});
