function fetchBooks() {
  fetch('http://localhost:5500/books')
    .then(handleResponse)
    .then(displayBooksList)
    .catch(handleError);
}

function displayBooksList(books) {
  const booksList = document.getElementById('booksList');
  booksList.innerHTML = ''; 

  books.forEach((book) => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.style.backgroundColor = book.color; 
    listItem.innerHTML = `
      <strong>${book.title}</strong> by ${book.author}, Genre: ${book.genre}, Year: ${book.publicationYear}
      <div class="float-right">
        <button class="btn btn-sm btn-secondary" onclick="editBook(${book.id})">Edit</button>
        <button class="btn btn-sm btn-info" onclick="deleteBook(${book.id})">Delete</button>
      </div>
    `;
    booksList.appendChild(listItem);
  });
}

function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

function handleError(error) {
  console.error('Error:', error);
}

function displayBooks(data, id = null) {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `http://localhost:5500/books/${id}` : 'http://localhost:5500/books';

  const requestData = id ? { ...data, id } : data;

  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then(handleResponse)
    .then((book) => {
      console.log(`Book ${id ? 'updated' : 'created'} successfully:`, book);
      showModal(`Book ${id ? 'updated' : 'created'} successfully.`);
      fetchBooks();
      document.getElementById('bookForm').reset();
    })
    .catch(handleError);
}


function deleteBook(id) {
  if (confirm('Are you sure you want to delete this book?')) {
    fetch(`http://localhost:5500/books/${id}`, {
      method: 'DELETE',
    })
      .then(handleResponse)
      .then((deletedBook) => {
        console.log('Book deleted successfully:', deletedBook);
        showModal('Book deleted successfully.');
        fetchBooks();
      })
      .catch(handleError);
  }
}

function editBook(id) {
  fetch(`http://localhost:5500/books/${id}`)
    .then(handleResponse)
    .then((book) => {
      document.getElementById('id').value = book.id;
      document.getElementById('title').value = book.title;
      document.getElementById('author').value = book.author;
      document.getElementById('genre').value = book.genre;
      document.getElementById('year').value = book.publicationYear;
    })
    .catch(handleError);
}

function updateBook() {
  const id = document.getElementById('id').value;
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const genre = document.getElementById('genre').value;
  const year = document.getElementById('year').value;

  if (!id) {
    console.error('No book id specified for update.');
    return;
  }

  const data = { id, title, author, genre, year }; // Fix the order here

  fetch(`http://localhost:5500/books/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(handleResponse)
    .then((updatedBook) => {
      console.log(`Book updated successfully:`, updatedBook);
      showModal('Book updated successfully.');
      fetchBooks();
      document.getElementById('bookForm').reset();
    })
    .catch(handleError);
}




function saveBook() {
  const id = document.getElementById('id').value;
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const genre = document.getElementById('genre').value;
  const year = document.getElementById('year').value;

  const data = { title, author, genre, year };

  if (id) {
    displayBooks(data, id);
  } else {
    displayBooks(data);
  }
}

function showModal(message) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">×</span>
      <p>${message}</p>
    </div>
  `;

  document.body.appendChild(modal);

  modal.style.display = 'block';

  modal.querySelector('.close-button').onclick = function() {
    modal.style.display = 'none';
    document.body.removeChild(modal);
  };
}

fetchBooks();
