const inform = console.log;
const { nanoid } = require('nanoid');
const readlineSync = require('readline-sync')
const { readJSONFile, writeJSONFile } = require('./src/helpers')
const { create, index, show, edit, destroy } = require('./src/bookStoreController')
const { createAccount, browse, seeDetails, addToCart, removeFromCart, purchaseBook } = require('./src/customerController')
// Sample employee ID array;
const employeeIdArr = require('./data/employeeData')
// const customerData = require('./data/customerData')

function run(){

    let bookstoreInventory = readJSONFile("./data", "bookstoreInventory.json")

    const isEmployee = verifyEmployee();

    if(isEmployee){
        const employeeActions = ["Create Book", "List All Books", "Show Book", "Edit Book", "Delete Book"]
        const action = readlineSync.keyInSelect(employeeActions, "Select an action")
        let writeToFile = false;
        let updatedInventory = [];

        switch(action) {
            case 0 :
                updatedInventory = create(bookstoreInventory);
                writeToFile = true;
                break;
            case 1 :
                index(bookstoreInventory);
                break;
            case 2 :
                let stockNumber = readlineSync.question("Please enter stock number: ")
                show(bookstoreInventory, stockNumber)
                break;
            case 3 :
                stockNumber = readlineSync.question("Please enter stock number: ");
                const price = readlineSync.question("What is the new Price ?");
                const inStock = readlineSync.keyInYNStrict("Is it in stock? Select Y for Yes or N for No");
                const quantity = readlineSync.question("How many copies are available?")
                const updatedBook = {price, inStock, quantity, quantityAvailable: quantity}
                updatedInventory = edit(bookstoreInventory, stockNumber, updatedBook)
                writeToFile = true;
                break;
            case 4 :
                stockNumber = readlineSync.question("Please enter the stock number of book you wish to delete");
                updatedInventory = destroy(bookstoreInventory, stockNumber);
                writeToFile = true;
                break;
        }

        if(writeToFile){
            writeJSONFile('./data', 'bookstoreInventory.json', updatedInventory);
        }
    } else {

        let customers = readJSONFile("./data", "customerData.json")
        let hasAccount = checkAccountStatus();

        if(!hasAccount){
           const wantsAccount = readlineSync.question("Would you like to create an account?")
            if(wantsAccount){
                const customerName = readlineSync.question("Please enter your name");
                createAccount(customers, customerName);
                hasAccount = true;
                writeJSONFile("./data", "customerData.json", customers);
            }
        }

        const customerId = readlineSync.question("Please enter your customer id");
        const customerActions = ["Browse books", "See book details", "Add a book to cart", "Remove from cart", "Purchase book"]
        const action = readlineSync.keyInSelect(customerActions, "What would you like to do?");
        let writeToFile = false;
        let updatedCustomers = [];

        switch(action){
            case 0 :
                browse(bookstoreInventory);
                break;
            case 1 :
                let stockNumber = readlineSync.question("Enter stock number of the book");
                seeDetails(bookstoreInventory, stockNumber);
                break;
            case 2 :
                if(hasAccount){
                stockNumber = readlineSync.question("Enter stock number of the book");
                updatedCustomers = addToCart(customers, customerId, bookstoreInventory, stockNumber);
                writeToFile = true;
                } else {
                    inform("You must create an account to perform this action")
                }
                break;
            case 3 :
                if(hasAccount){
                stockNumber = readlineSync.question("Enter stock number of the book");
                updatedCustomers = removeFromCart(customers, customerId, stockNumber);
                writeToFile = true;
                } else {
                    inform("You must create an account to perform this action")
                }
                break;
            case 4 :
                if(hasAccount){
                stockNumber = readlineSync.question("Enter stock number of the book");
                updatedCustomers = purchaseBook(customers, bookstoreInventory, customerId, stockNumber)
                writeToFile = true;
                } else {
                    inform("You must create an account to perform this action")
                }
                break;
        }

        if(writeToFile){
            writeJSONFile('./data', 'customerData.json', updatedCustomers);
        }
    }
}

run();


// helper function to verify if employee.
const verifyEmployee = () => {

    const isEmployee = readlineSync.keyInYNStrict("Are you an employee? Press Y for Yes or N for No");

    if (isEmployee){
      const employeeId = readlineSync.question("Please enter your employee ID");
      if(employeeIdArr.includes(employeeId)){
        return true
      } else {
        inform("Invalid employee ID, access denied! Please choose from customer options if you are a customer.");
        return false;
      }
    } else{
      inform("Please choose from customer options")
      return false;
    }
}

  // helper function to verify customer account

  const checkAccountStatus = () => {
    const hasAccount = readlineSync.keyInYNStrict("Do you have an account? Press Y for Yes of N for No");
    if(hasAccount){
        const customerId = readlineSync.question("Please enter your customer ID");
        const customer = customerData.find(customer => customer.id === customerId);
        return customer ? true : false;
    }
    inform("Please create an account");
    return false;
  }

// const APIKey = 'AIzaSyD9rw6HLka49KSRDnfbTxHA975BoWsBvto';
// let title = "things fall apart"
// let currentBook;
// fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}&key=${APIKey}`)
//             .then(res => res.json())
//             .then(res => {
//                 currentBook = res.items[0];
//                 console.log(currentBook)
//             })
//             .catch(error => console.log(error))

// const create = (param, value) => {

    // let newBook = {};

    // if(param === 'title') {
    //    return fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${value}&key=${APIKey}`)
    //         .then(res => res.json())
    //         .then(res => {
    //             if (res.items && res.items.length > 0) {
    //                 const { title, authors } = res.items[0].volumeInfo;
    //                 newBook = { title, authors};
    //                 return newBook;
    //             } else {
    //                 console.log('No books found');
//                     return null
//                 }
//             })
//             .catch(error => {
//                 console.log(error)
//                 return null;
//             })
//     }
//     return Promise.resolve(newBook);
// }

// const create = async (param, value) => {
//     let newBook;

//     if (param === 'title') {
//         try {
//             const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${value}&key=${APIKey}`);
//             const data = await res.json();
//             if (data.items && data.items.length > 0) {

//                 const { title, authors, subtitle,publisher, publishedDate, averageRating, ratingsCount } = data.items[0].volumeInfo;
//                 const { listPrice, retailPrice, buyLink} = data.items[0].saleInfo;
//                 const { id } = data.items[0]
//                 const datePublished = publishedDate;
//                 recommendedPrice = listPrice ? listPrice : "Not for Sale";
//                 ourPrice = retailPrice ? retailPrice : 'Not for Sale'
//                 link = buyLink ? buyLink : 'N/A';

//                 newBook = { id,
//                             inventoryNumber: nanoid(4),
//                             title,  
//                             authors, 
//                             publisher, 
//                             datePublished,
//                             ratingsInfo: {
//                                 averageRating,
//                                 ratingsCount,
//                             },
//                             saleInfo : {recommendedPrice,
//                             ourPrice,
//                             link}
//                         };
//             } else {
//                 console.log('No books found.');
//                 newBook = null;
//             }
//         } catch (error) {
//             console.log('Error fetching book data:', error);
//             newBook = null;
//         }
//     }

//     return newBook;
// };

// const createBook = (param, value) => {
//     let newBook = {};
    
//     if (param === 'title') {
//         return fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${value}&key=${APIKey}`)
//             .then(res => res.json())
//             .then(data => {
//                 if (data.items && data.items.length > 0) {
//                     const { title, authors, subtitle, publisher, publishedDate, industryIdentifiers, averageRating, ratingsCount } = data.items[0].volumeInfo;
//                     const { listPrice, retailPrice, buyLink } = data.items[0].saleInfo;
//                     const { id } = data.items[0];
//                     const datePublished = publishedDate;
//                     const recommendedPrice = listPrice ? listPrice.amount : "Not for Sale";
//                     const ourPrice = retailPrice ? retailPrice.amount : 'Not for Sale';
//                     const link = buyLink ? buyLink : 'N/A';

//                     newBook = { 
//                         id,
//                         inventoryNumber: nanoid(4),  
//                         title,  
//                         authors, 
//                         subtitle,
//                         publisher, 
//                         datePublished,
//                         isbn: industryIdentifiers,
//                         ratingsInfo: {
//                             averageRating,
//                             ratingsCount,
//                         },
//                         saleInfo: {
//                             recommendedPrice,
//                             ourPrice,
//                             inStock: true,
//                             link
//                         }
//                     };

//                     return newBook;
//                 } else {
//                     console.log('No books found.');
//                     return null;
//                 }
//             })
//             .catch(error => {
//                 console.log('Error fetching book data:', error);
//                 return null;
//             });
//     }

//     return Promise.resolve(newBook);
// };

// // create('title', "dreams of my father").then(book => console.log(book));

// // (createBook('title', "dreams of my father")).then(book => console.log(book))

// // console.log(createCustomerAccount('David Bowie'))