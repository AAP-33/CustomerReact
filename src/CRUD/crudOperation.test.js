import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import BankingCrudOperation from "./crudOperation";

// Create a mock instance for axios
const mock = new MockAdapter(axios);

describe("BankingCrudOperation", () => {
  beforeEach(() => {
    // Mock the GET request
    mock.onGet("http://localhost:8888/customer/read").reply(200, [
      {
        id: 1,
        name: "John Doe",
        balance: 100,
        email: "john@example.com",
        aadharcardnumber: "123456789012",
        accountnumber: "1111111111",
        phonenumber: "1234567890",
        username: "johndoe",
        password: "password123",
      },
    ]);
  });

  afterEach(() => {
    mock.reset();
  });

  test("renders component and fetches customers", async () => {
    render(<BankingCrudOperation />);

    // Check if the heading is rendered
    expect(screen.getByText("Banking CRUD Example")).toBeInTheDocument();

    // Check if the table headers are rendered
    expect(screen.getByText("Name")).toBeInTheDocument();

    // Wait for the customers to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  test("adds a new customer", async () => {
    // Mock the POST request
    mock.onPost("http://localhost:8888/customer/add").reply(200, {
      id: 2,
      name: "Jane Doe",
      balance: 200,
      email: "jane@example.com",
      aadharcardnumber: "987654321098",
      accountnumber: "2222222222",
      phonenumber: "0987654321",
      username: "janedoe",
      password: "password123",
    });

    render(<BankingCrudOperation />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("Customer Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Balance"), {
      target: { value: 200 },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Aadhar Card Number"), {
      target: { value: "987654321098" },
    });
    fireEvent.change(screen.getByPlaceholderText("Account Number"), {
      target: { value: "2222222222" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "0987654321" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "janedoe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // Click the add button
    fireEvent.click(screen.getByText("Add Customer"));

    // Wait for the new customer to be added to the list
    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  });

  test("displays email validation error", async () => {
    render(<BankingCrudOperation />);

    // Fill out the form with invalid email
    fireEvent.change(screen.getByPlaceholderText("Customer Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Balance"), {
      target: { value: 200 },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });

    // Click the add button
    fireEvent.click(screen.getByText("Add Customer"));

    // Check if the email validation error is displayed
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });

  // More tests for update, delete, and other functionalities can be added similarly
});
