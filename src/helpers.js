const { readFileSync, writeFileSync } = require("node:fs");

function readJSONFile(path, fileName) {
  const collection = readFileSync(`${path}/${fileName}`, "utf8");
  return collection ? JSON.parse(collection) : [];
}

function writeJSONFile(path, fileName, data) {
  data = JSON.stringify(data);
  return writeFileSync(`${path}/${fileName}`, data, { encoding: "utf-8" });
}


//helpers to find book and customer by stocknumber or ID
const findCustomer = (customerData, customerId) => {
  return customerData.find(customer => customer.id === customerId)
}

const findBook = (inventory, stockNumber) => {
  return inventory.find(book => book.stockNumber === stockNumber)
}

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


module.exports = {
  readJSONFile,
  writeJSONFile,
  findBook,
  findCustomer,
  verifyEmployee
};