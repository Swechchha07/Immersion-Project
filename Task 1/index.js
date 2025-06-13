const addButton = document.getElementById('addButton');
const progressContainer = document.getElementById('progressContainer');

addButton.addEventListener('click', () => {
 
  const wrapper = document.createElement('div');
  wrapper.className = 'progress-wrapper';

  const bar = document.createElement('div');
  bar.className = 'progress-bar';

  wrapper.appendChild(bar);
  progressContainer.appendChild(wrapper);

  
  requestAnimationFrame(() => {
    bar.style.width = '100%';
  });
});
