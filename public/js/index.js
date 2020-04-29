const deleteButtons = document.getElementsByClassName('delete');

for (let i = 0; i < deleteButtons.length; i++) {
  deleteButtons.item(i).addEventListener('click', async function(e) {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `mutation { deleteTask(_id: \"${this.parentNode.id}\") }`
      })
    };
    await fetch(`http://localhost:8000/graphql`, options);
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
  if (document.getElementById('users')) {
    document.getElementById('users').innerText = count;
  }
};

socket.on('new user', ({ users }) => {
  setUserCount(users);
});

socket.on('user disconnected', ({ users }) => {
  setUserCount(users);
});

const registerForm = document.getElementById('register-form');
registerForm && registerForm.addEventListener('submit', async () => {
  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `mutation { createUser(userInput: { login: "${login}", password: "${password}" }) }`
    })
  };
  await fetch(`http://localhost:8000/graphql`, options);
  location.href = '/login';
});

const loginForm = document.getElementById('login-form');
loginForm && loginForm.addEventListener('click', async () => {
  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `mutation { loginUser(userInput: { login: "${login}", password: "${password}" }) }`
    })
  };
  await fetch(`http://localhost:8000/graphql`, options);
  location.href = '/';
});
