const { nanoid } = require("nanoid");
const readlineSync = require('readline-sync');
const { findBook } = require("./helpers");
const APIKey = 'AIzaSyD9rw6HLka49KSRDnfbTxHA975BoWsBvto';
// let title = "things fall apart"
// let currentBook;
const inform = console.log;


const create = (bookstoreInventory) => {
    
    let isCustomer;
    const isEmployee = readlineSync.keyInYNStrict("Are you an employee? Press Y for Yes or N for No");
    const employeeId = () => {

        return isEmployee ? readlineSync.question("Please enter your employee ID") : null;
    }
    const canCreateBook = isEmployee && employeeIdArr.includes(employeeId());
    isCustomer = !isEmployee;

    if(canCreateBook){
        let newBook = {};
        const createMethod = ["input info", "fetch info from API"]
        const enterInfoOrFetchInfo = readlineSync.keyInSelect(createMethod, "How would you like to input book information?");
        
        if(enterInfoOrFetchInfo === 0){
            const title = readlineSync.question("Enter the book title: ");
            const author = readlineSync.question("Enter the book author: ");
            const publisher = readlineSync.question("Enter the publisher: ");
            const publishedDate = readlineSync.question("Enter the published date ");
            const price = readlineSync.question("Enter the price: ");

            let foundBook = bookstoreInventory.find(book => book.title === title && book.author === author)

            if(foundBook){
                foundBook.quantity++;
                inform(`${foundBook.title} already exists. Quantity incremented`);
            } else {
                    
                newBook = {
                    id: nanoid(4),
                    title,
                    author,
                    publisher,
                    publishedDate,
                    price,
                    quantity: 1,
                    inStock : newBook.quantity > 0 ? "Yes": "No"
                }
            
                bookstoreInventory.push(newBook);
                inform(`${newBook.title} successfully added to inventory!`);
            }

            return bookstoreInventory;

        } else if(enterInfoOrFetchInfo === 1) {
            const title = readlineSync.question("Enter the book title: ");

                return fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}&key=${APIKey}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.items && data.items.length > 0) {
                            const { title, authors, subtitle, publisher, publishedDate, industryIdentifiers, averageRating, ratingsCount, categories } = data.items[0].volumeInfo;
                            const { listPrice, retailPrice, buyLink } = data.items[0].saleInfo;
                            const { id } = data.items[0];
                            const datePublished = publishedDate;
                            const recommendedPrice = listPrice ? listPrice.amount : "Not for Sale";
                            const ourPrice = retailPrice ? retailPrice.amount : 'Not for Sale';
                            const link = buyLink ? buyLink : 'N/A';

                            
                            const foundBook = bookstoreInventory.find(book => book.id === id);
                            if (foundBook){
                                foundBook.saleInfo.quantityAvailable++;
                                inform(`${foundBook.title} already exists, quantity incremented.`);
                                return bookstoreInventory;
                            }
    
                            newBook = { 
                                id,
                                stockNumber: nanoid(4),  
                                title,  
                                authors, 
                                subtitle,
                                publisher, 
                                datePublished,
                                categories,
                                isbn: industryIdentifiers,
                                ratingsInfo: {
                                    averageRating,
                                    ratingsCount,
                                },
                                saleInfo: {
                                    recommendedPrice,
                                    ourPrice,
                                    quantityAvailable: 1,
                                    inStock: newBook.saleInfo.quantityAvailable > 0 ? "Yes" : "No",
                                    link
                                }
                            };
                            
                            inform(newBook);
                            bookstoreInventory.push(newBook);
                            inform(`${newBook.title} successfully added to inventory!`)
                            return bookstoreInventory;

                        } else {
                            console.log(`Uh oh! No books by title "${title}" found.`);
                            return null;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching book data:', error);
                        return null;
                    });
                    
            }
        
    } else {
        inform(`Only employees are authorized to modify the inventory!`)
    };
}

const index = (inventory) => {
    return inventory.map(book => {
      const  { stockNumber, inStock, title, authors, ratingsInfo, saleInfo, categories } = book;
      return {
        stockNumber,
        title,
        authors
      }
    })
    .join("\n")
}

const show = (inventory, stockNumber) => {
    return inventory.find(book => book.stockNumber === stockNumber)
};

const edit = (inventory, stockNumber, updatedBook) => {
    const index = inventory.findIndex(book => book.stockNumber === stockNumber)
    if(index > -1){
        const { price, inStock, quantity, quantityAvailable} = updatedBook
        inventory[index].price = price;
        if(quantity && inventory[index].quantity){
            inventory[index].quantity = quantity;
        }
        if(quantityAvailable && inventory.saleInfo.quantityAvailable){
            inventory[index].quantityAvailable = quantityAvailable
        }
        inventory[index].inStock = inStock;
        inform("Book successfully updated")
    } else {
        inform("Book not found, no action taken")
    }
    return inventory;
}


const destroy = (inventory, stockNumber) => {
    const book = findBook(inventory, stockNumber);
    if(book){
    inventory.splice(inventory.indexOf(book), 1);
    inform(`${book.title} successfully removed from inventory`)
    return inventory;
    } else {
        inform(`No book with stocknumber ${stockNumber} found, please verify info.`)
    }
}


// (createBook('title', "dreams of my father")).then(booyk => console.log(book))

// console.log(createCustomerAccount([],'David Bowie'))
// createBook()

module.exports = { create, index, destroy, edit, show }