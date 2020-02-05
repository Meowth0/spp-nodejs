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
