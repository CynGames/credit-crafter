# Credit Crafter Project

Credit Crafter is a mock Loan Application that aims to simulate the basic functionalities of a loan company core
processes with a microservice architecture.

## Table Of Content

* [Secrets](#secrets)
* [Description](#description)
* [Technologies](#technologies)
* [Installation](#installation)
* [Running the app](#running-the-app)
* [Database Schema Documentation](#database-schema-documentation)
* [API Documentation](#api-documentation-swagger)

## Secrets

Download and place both the `.env` and the `serviceAccount.json` file at the root of api-gateway module.
(Needs a Solvd Gmail Account)

https://drive.google.com/drive/folders/1IgQSKJELIQ2z9OsJTEAZ8WKIOBgO6TU0?usp=sharing

## Description

Web application for tracking loan requests and payment.

The main functions are:

* User registration and authentication through Firebase.
* Being able to add financial data such as expenses and income to a user.
* Ask for a loan, have an admin approve of it and pay it across installments.

## Technologies

**Framework**: Nest.js

**API Query Language**: REST

**Database**: Firebase for Auth, Postgresql for the rest of the application.

**Containerization**: Docker for Postgresql databases.

**Message Broker**: Kafkajs

**WebUI**: Kafdrop

**Documentation**: Swagger & Postman

## Installation

```bash
# installation of dependences
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Database Schema Documentation

[//]: # (![DB schema]&#40;<DB-schema.png>&#41;)

### 1. Users Table

**Description:** Stores basic information about users registered in the Loan Application, including their roles and link
to their financial data.

| Field             | Type         | Description                                                     | Nullable? |
|-------------------|--------------|-----------------------------------------------------------------|-----------|
| user_id           | VARCHAR      | Primary key, unique identifier for each user.                   | false     |
| first_name        | VARCHAR(256) | User's first name.                                              | false     |
| last_name         | VARCHAR(256) | User's last name.                                               | false     |
| email             | VARCHAR(256) | User's email address, used for logging in. Unique across users. | false     |
| roles             | VARCHAR(256) | List of roles assigned to the user.                             | false     |
| created_at        | TIMESTAMP    | The date and time when the user account was created.            | false     |
| updated_at        | TIMESTAMP    | The date and time of the last account update.                   | false     |
| financial_data_id | VARCHAR (FK) | Foreign key linking to the financial_data table.                | true      |

### 2. Financial Data Table

**Description:** Stores financial information related to users, such as credit scores, income, and expenses.

| Field             | Type      | Description                                                       | Nullable? |
|-------------------|-----------|-------------------------------------------------------------------|-----------|
| financial_data_id | VARCHAR   | Primary key, unique identifier for each financial data entry.     | false     |
| credit_score      | INTEGER   | User's credit score, indicating the creditworthiness of the user. | true      |
| income            | INTEGER   | Monthly income of the user.                                       | true      |
| expenses          | INTEGER   | Monthly expenses of the user.                                     | true      |
| created_at        | TIMESTAMP | The date and time when the financial data was first recorded.     | false     |
| updated_at        | TIMESTAMP | The date and time of the last update to the financial data.       | false     |

### 3. States Table

**Description:** Stores the possible states a loan can be in throughout its lifecycle.

| Field      | Type    | Description                                                             | Nullable ? |
|------------|---------|-------------------------------------------------------------------------|------------|
| state_id   | UUID    | Primary key, unique identifier for each state. Generated automatically. | false      |
| state_name | VARCHAR | The name of the loan state (e.g., toReview, Approved, Denied, Paid).    | false      |

### 4. Loan Table

**Description:** Contains details about loans issued to users, including the loan amount and current state.

| Field        | Type          | Description                                                                        | Nullable ? |
|--------------|---------------|------------------------------------------------------------------------------------|------------|
| loan_id      | UUID          | Primary key, unique identifier for each loan. Generated automatically.             | false      |
| user_id      | VARCHAR(256)  | Identifier linking the loan to a user in the users table                           | false      |
| approved_by  | UUID          | Identifier of the admin or system that approved the loan.                          | false      |
| amount       | NUMERIC(15,2) | The total amount of the loan.                                                      | false      |
| installments | INTEGER       | The number of installments for loan repayment.                                     | false      |
| end_date     | DATE          | The expected date for the final loan repayment.                                    | false      |
| loan_type    | VARCHAR(256)  | Type of the loan (e.g., personal, auto, mortgage).                                 | false      |
| state_id     | UUID          | Foreign key linking to the states table to indicate the current state of the loan. | false      |
| created_at   | TIMESTAMP     | The date and time when the loan was created.                                       | false      |
| updated_at   | TIMESTAMP     | The date and time of the last update to the loan.                                  | false      |

### 5. Payment Table

**Description:** Tracks payments made towards loans, including the amount paid.

| Field       | Type          | Description                                                               | Nullable ? |
|-------------|---------------|---------------------------------------------------------------------------|------------|
| payment_id  | UUID          | Primary key, unique identifier for each payment. Generated automatically. | false      |
| loan_id     | UUID          | Foreign key linking the payment to a specific loan in the loan table.     | false      |
| amount_paid | NUMERIC(15,2) | The amount paid in this installment.                                      | true       |
| created_at  | TIMESTAMP     | The date and time when the payment record was created.                    | false      |
| updated_at  | TIMESTAMP     | The date and time of the last update to the payment record.               | false      |

#### Relationships

**Loans to States**: Many-to-One. Each loan can be in one state at any given time, facilitating the tracking and
management of the loan's lifecycle (e.g., toReview, Approved, Denied, Paid). This relationship requires adding a state_id field to
the Loan table to establish a foreign key relationship with the States table.

**Users to Loans**: One-to-Many. A single user can have multiple loans, but each loan is associated with one user. This
relationship is established through the user_id field in the Loan table, which acts as a foreign key to the Users table.

**Loans to Payments**: One-to-Many. A single loan can have multiple payments made towards it, but each payment is
associated with one specific loan. This relationship is established through the loan_id field in the Payment table, which acts as a
foreign key to the Loan table.

**Payments to Loans**: Many-to-One. Each payment is made towards one specific loan, helping track the repayment progress
of the loan. This relationship is established by the loan_id field in the Payment table, creating a link to the
corresponding loan in the Loan table.

## API Documentation (Swagger)

1 - Navigate to the `api-gateway` folder.

2 - Run the application `npm run start:dev`.

3 - Open `localhost:3000/api` route in the browser.