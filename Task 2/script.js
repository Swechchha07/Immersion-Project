const app = document.getElementById('app');
const addBtn = document.getElementById('btn');

addBtn.addEventListener('click', () => {
  const note = document.createElement('textarea');
  note.classList.add('note');
  note.placeholder = 'Write here...';

  note.addEventListener('dblclick', () => {
    app.removeChild(note);
  });

  app.insertBefore(note, addBtn);
});