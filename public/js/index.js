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

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.datepicker');
  var instances = M.Datepicker.init(elems, { format: 'dd mmmm yyyy' });
});

const socket = io.connect('http://localhost:8000');

setUserCount = count => {
  document.getElementById('users').innerText = count;
};

socket.on('new user', ({ users }) => {
  setUserCount(users);
});

socket.on('user disconnected', ({ users }) => {
  setUserCount(users);
});

