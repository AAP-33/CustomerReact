import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function BankingCrudOperation() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);
  const [email, setEmail] = useState("");
  const [aadharcardnumber, setAadharCardNumber] = useState("");
  const [accountnumber, setaccountNumber] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8888/customer/read")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the customers!", error);
      });
  }, []);

  const createCustomer = () => {
    axios
      .post("http://localhost:8888/customer/add", {
        name,
        balance,
        email,
        aadharcardnumber,
        accountnumber,
        phonenumber,
        username,
        password,
      })
      .then((response) => {
        setCustomers([...customers, response.data]);
        resetForm();
      })
      .catch((error) => {
        console.error("There was an error creating the customer!", error);
      });
  };

  const updateCustomer = (customer) => {
    axios
      .put(`http://localhost:8888/customer/update/${customer.id}`, {
        name,
        balance,
        email,
        aadharcardnumber,
        accountnumber,
        phonenumber,
        username,
        password,
      })
      .then((response) => {
        setCustomers(
          customers.map((c) => (c.id === customer.id ? response.data : c))
        );
        setEditingCustomer(null);
        resetForm();
      })
      .catch((error) => {
        console.error("There was an error updating the customer!", error);
      });
  };

  const deleteCustomer = (id) => {
    axios
      .delete(`http://localhost:8888/customer/delete/${id}`)
      .then(() => {
        setCustomers(customers.filter((customer) => customer.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the customer!", error);
      });
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setBalance(customer.balance);
    setEmail(customer.email);
    setAadharCardNumber(customer.aadharcardnumber);
    setaccountNumber(customer.accountnumber);
    setPhoneNumber(customer.phonenumber);
    setUsername(customer.username);
    setPassword(customer.password);
  };

  const handleSaveClick = () => {
    if (editingCustomer) {
      updateCustomer(editingCustomer);
    } else {
      if (validateEmail(email)) {
        createCustomer();
      } else {
        setEmailError("Invalid email format");
      }
    }
  };

  const resetForm = () => {
    setName("");
    setBalance(0);
    setEmail("");
    setAadharCardNumber("");
    setaccountNumber("");
    setPhoneNumber("");
    setUsername("");
    setPassword("");
    setEmailError("");
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div className="App bg-light p-4 text-center">
      <h1 className="m-0">Banking CRUD Example</h1>
      <div className="d-flex flex-column align-items-center gap-2 mb-4">
        <input
          type="text"
          className="form-control p-2"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          className="form-control p-2"
          placeholder="Balance"
          value={balance}
          onChange={(e) => setBalance(Number(e.target.value))}
        />
        <input
          type="email"
          className="form-control p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p className="text-danger">{emailError}</p>}
        <input
          type="number"
          className="form-control p-2"
          placeholder="Aadhar Card Number"
          value={aadharcardnumber}
          onChange={(e) => setAadharCardNumber(e.target.value)}
        />
        <input
          type="number"
          className="form-control p-2"
          placeholder="Account Number"
          value={accountnumber}
          onChange={(e) => setaccountNumber(e.target.value)}
        />
        <input
          type="tel"
          className="form-control p-2"
          placeholder="Phone Number"
          value={phonenumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="text"
          className="form-control p-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="form-control p-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSaveClick} className="btn btn-primary p-2">
          {editingCustomer ? "Update Customer" : "Add Customer"}
        </button>
      </div>
      <table className="table table-striped">
        <thead className="bg-primary text-white">
          <tr>
            <th>Name</th>
            <th>Balance</th>
            <th>Email</th>
            <th>Aadhar Card Number</th>
            <th>Account Number</th>
            <th>Phone Number</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.balance}</td>
              <td>{customer.email}</td>
              <td>{customer.aadharcardnumber}</td>
              <td>{customer.accountnumber}</td>
              <td>{customer.phonenumber}</td>
              <td>{customer.username}</td>
              <td>
                <button
                  onClick={() => handleEditClick(customer)}
                  className="btn btn-warning btn-sm mx-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCustomer(customer.id)}
                  className="btn btn-danger btn-sm mx-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BankingCrudOperation;
