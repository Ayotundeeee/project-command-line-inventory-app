const {  findBook, findCustomer } = require('./helpers')


const createAccount = (customerData, customerName) => {
    const newCustomer = {
        id: nanoid(4),
        name: customerName,
        shoppingCart: [],
        userLibrary: []
    }

    customerData.push(newCustomer);
    inform(`Your customer ID is ${newCustomer.id}, keep for future use.`)
    return customerData;
}

const browse = (books) => {
    return books.map(book => {
      const  { stockNumber, inStock, title, authors, ratingsInfo, saleInfo, categories } = book;
      return {
        stockNumber,
        title,
        authors
      }
    })
    .join("\n")
}

const seeDetails = (bookstoreInventory, stockNumber) => {
    const book = findBook(bookstoreInventory, stockNumber)
    const  { stockNumber, inStock, title, authors, ratingsInfo, saleInfo, categories } = book;
      return {
        stockNumber,
        title,
        authors,
        ratingsInfo,
        categories,
        price: saleInfo.ourPrice,
        inStock
      }
}

const addToCart = (customerData, customerId, bookstoreInventory, stockNumber) => {
    const currentCustomer = findCustomer(customerData, customerId);
    const book = findBook(bookstoreInventory, stockNumber);
    if(currentCustomer && book){
        currentCustomer.shoppingCart.push(book);
        inform(`${book.title} successfully added to your cart. run \"npm cart to view all items\"`)
        return customerData;
    } else if(!currentCustomer){
        inform("Customer not found, please verify customer id")
        return customerData
    } else if(!book){
        inform("Book not found, please verify book ID")
        return customerData;
    }
}

const removeFromCart = (customerData, customerId, stockNumber) => {

    const currentCustomer = findCustomer(customerData, customerId);
    const cart = currentCustomer.shoppingCart;
    targetBook = findBook(cart, stockNumber);

    if(targetBook){
        cart.splice(cart.indexOf(targetBook), 1);
        inform(`${targetBook.title} successfully removed from your cart`);
    } else {
        inform(`${targetBook.title} not found in cart`);
    }
}

const purchaseBook = (customerData, bookstoreInventory, customerId, stockNumber) => {
    const customer = findCustomer(customerData, customerId);
    const targetBook = findBook(shoppingCart, stockNumber);

    if(customer && targetBook) {
        const book = customer.shoppingCart.splice(shoppingCart.indexOf(targetBook), 1)
        customer.userLibrary.push(book);
        
        const inventoryBook = findBook(bookstoreInventory, stockNumber);
        inventoryBook.saleInfo.quantityAvailable && inventoryBook.saleInfo.quantityAvailable--;
        inform(`Purchase successful, ${targetBook.title} added to your library!`)
        return customerData;
    } else if(!customer){
        inform("customer not found. Please verify ID.")
        return customerData;
    } else if(!targetBook){
        inform("Book not found. Please verify stock number.")
    }
  
}

module.exports = { createAccount, browse, seeDetails, addToCart, removeFromCart, purchaseBook }