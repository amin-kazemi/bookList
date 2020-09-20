class Book{
  constructor(title, author, isbn){
    // property
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}


class UI{
  //Add book to list method
  addBookToList(book){
   
    //Target parent
    const list = document.querySelector('#book-list');
    //Create tr element
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
  showAlert(message, className){

     //Create div element
     const div = document.createElement('div');
     //Add classes
     div.className = `alert ${className}`;
     //Add text node
     div.appendChild(document.createTextNode(message));
     //Target parent element
     const container = document.querySelector('.container');
     //Target the form
     const form = document.querySelector('#book-form');
     //Insert alert
     container.insertBefore(div, form);
 
     //time out after 3 sec ->Disapear the Error method
     setTimeout(function(){
       document.querySelector('.alert').remove();
     },3000);
  }

  //Delete book function
  deleteAddBook(target){

    if(target.className === 'delete'){
      target.parentElement.parentElement.remove();
    };
  }

  //Clean fileds method
  clearFileds(){
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}


//And now i am going put set datas into localStorage, and also i'm going to make all the classes static meaning that we don't have to instantiate the storage

//Local Storage class

class Store {

  //Get Books which fetch data from local storage. The purpose of creating this method is preventing of repiting so one method take care of that and when ever we need just callback this method.
  static getBooks() {
    let books;

    if(localStorage.getItem('books') === null) {
      books = [];
    }else{
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  //Display Books method which is displaying the data in UI
  static displayBooks() {
    const books = Store.getBooks();

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
  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);
    
    //set it back to local storage
    localStorage.setItem('books', JSON.stringify(books));
  }

  //Remove Book method
  static removebook(isbn) {
     //Its a bit tricky since we don't have IP so we need sth uniqe so i choose isbn to target

     const books = Store.getBooks();

     books.forEach (function(book, index){
       if(book.isbn === isbn){
        books.splice(index, 1);
       }
  });
   localStorage.setItem('books', JSON.stringify(books));
 }
}


//DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//Event Listeners for add book
document.querySelector('#book-form').addEventListener('submit', function(e){
  //Get form values
  const title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;

  //Instantiat book object
  const book = new Book(title, author, isbn);
  

  //Instantiat ui object
  const ui = new UI();
  

  //Validation the form
  if(title === '' || author === '' || isbn === ''){
    //Show alert error
    ui.showAlert('Please fill in all fields', 'error');

  }else{

    //Add book callback
    ui.addBookToList(book);

    //Add book to LS
    Store.addBook(book);

    //Show success alert
    ui.showAlert('Book Added!', 'success');

    //Clear fields callback
    ui.clearFileds();
  }


  e.preventDefault();
});


//Event Listeners for deleteing book 
document.getElementById('book-list').addEventListener('click', function(e){
  
  //Instantiat(create) UI object
  const ui = new UI();
  
  //Delete function callback
  ui.deleteAddBook(e.target);

  //Delete or remove form LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //Show delete success alert
  ui.showAlert('Book removed!', 'success');


  e.preventDefault();
});



