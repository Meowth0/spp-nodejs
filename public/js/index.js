const deleteButtons = document.getElementsByClassName('delete');

for (let i = 0; i < deleteButtons.length; i++) {
  deleteButtons.item(i).addEventListener('click', async function(e) {
    await fetch(`/delete/${this.parentNode.id}`, {
      method: 'DELETE'
    });
    location.href = '/';
  });
}

const updateButtons = document.getElementsByClassName('update');

for (let i = 0; i < updateButtons.length; i++) {
  updateButtons.item(i).addEventListener('click', async function(e) {
    const req = `/update/${this.parentNode.id}`;
    await fetch(req);
    location.href = req;
  });
}

const socket = io.connect('http://localhost:8000');
socket.on('change title', data => {
  document.getElementById('navTitle').innerText = data.title;
});

setUserCount = count => {
  document.getElementById('users').innerText = count;
};

socket.on('new user', ({ users }) => {
  setUserCount(users);
});

socket.on('user disconnected', ({ users }) => {
  setUserCount(users);
});

