//Book Constructor (creating our book objects)
function Book(title, author, isbn){
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}




//UI Constructor (creating our prototype and methods)
function UI(){}


//Add book to list method
UI.prototype.addBookToList = function (book){

  const list = document.getElementById('book-list');

  //Create tr
  const row = document.createElement('tr');

  //Insert cols
  row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete">X</a></td>`;

  //Append row into list
  list.appendChild(row);
}


  //Show alert error method
  UI.prototype.showAlert = function(message, className){
    //create div element
    const div = document.createElement('div');
    //add classes -> all have alert class and the className which i pass in the function argument
    div.className = `alert ${className}`;
    // add text node
    div.appendChild(document.createTextNode(message));
    //target the parent(container)
    const container = document.querySelector('.container');
    //target the form
    const form = document.querySelector('#book-form');
    //Insert alert
    container.insertBefore(div, form);



    //time out after 3 sec ->Disapear the Error method
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 3000);
  }

  //Delete book function
  UI.prototype.deleteAddBook = function(target){

    if(target.className === 'delete') {
      target.parentElement.parentElement.remove();
    };
    
  }


  //Clean fileds method
  UI.prototype.clearFileds = function(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }



  //Store constructor(creating our prototype and methods)
  function Store (){}

  Store.prototype.getBooks = function(){
    let books;
    
    if(localStorage.getItem('books') === null) {
      books = [];
    }else{
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  //Display Books method which is displaying the data in UI
  Store.prototype.displayBooks = function() {
    //Instantiat(create) Stor object
    const store = new Store();
    const books = store.getBooks();

    //Loop through the ls and display data in ui
    books.forEach (function(book){
      //Now what we need to do after we get the books is put it into the UI and remember we have a class called UI that has a method called addBookToList() so we can simply instantiate that class

      //Instantiat ui
      const ui = new UI();

      ui.addBookToList(book);
      //so now we need to call it but first we need to create DOM LOAD EVENT event listener
    });
  }

  //Add Book method which add data to the local storage
  Store.prototype.addBook = function(book) {
    //Instantiat(create) Stor object
    const store = new Store();
    const books = store.getBooks();

    books.push(book);
    
    //set it back to local storage
    localStorage.setItem('books', JSON.stringify(books));
  }

  //Remove Book method
  Store.prototype.removeBook = function(isbn) {
    //Instantiat(create) Stor object
    const store = new Store();
     //Its a bit tricky since we don't have IP so we need sth uniqe so i choose isbn to target

     const books = store.getBooks();

     books.forEach (function(book, index){
       if(book.isbn === isbn){
        books.splice(index, 1);
       };
  });
   localStorage.setItem('books', JSON.stringify(books));
 }
  
 //Instantiat(create) Store object
 const store = new Store();



  
//DOM Load Event
document.addEventListener('DOMContentLoaded', store.displayBooks());

//Event Listeners for add book
document.getElementById('book-form').addEventListener('submit', function (e){
  //Get form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;


        
  //Instantiat(create) Book object
  const book = new Book(title, author, isbn);


  //Instantiat(create) UI object
  const ui = new UI();

  //Instantiat(create) Stor object
  const store = new Store();

  //Validation the form
  if(title === '' || author === '' || isbn === ''){

    //Show error alert callback ->it takes 2 prameters 'message' the class which is'error'.

    ui.showAlert('Please fill in all fields', 'error');

  }else{
    //Add book to list callback
    ui.addBookToList(book);

    //Add book to LS
    store.addBook(book);

    //Show success alert
    ui.showAlert('Book Added!', 'success');
  
    //Clear fileds callback
    ui.clearFileds();
  }
  
  
  e.preventDefault();
}); 


//Event Listeners for deleteing book 
document.getElementById('book-list').addEventListener('click', function(e){
  
  //Instantiat(create) UI object
  const ui = new UI();

  //Instantiat(create) Stor object
  const store = new Store();
  
  //Delete function callback
  ui.deleteAddBook(e.target);

  //Delete or remove form LS
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //Show delete success alert
  ui.showAlert('Book removed!', 'success');

  e.preventDefault();
});
