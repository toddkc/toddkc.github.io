'use strict';

function pageload() {
  // add event listener to modal close button
  document.getElementById('closeModal').addEventListener('click', () => {
    closeModal();
  });
  // add event listener to contact link
  document.getElementById('openContact').addEventListener('click', () => {
    openContact();
  });
  // open contact modal
  function openContact() {
    document.getElementById('contact').classList.add('is-active');
  }
  // close contact modal
  function closeModal() {
    document.getElementsByClassName('modal')[0].classList.remove('is-active');
  }
}
pageload();