create extension if not exists "uuid-ossp";

create table loan (

    loan_id uuid default uuid_generate_v4() primary key unique not null,
    user_id uuid not null,
    approved_by uuid,
    amount numeric(15, 2),
    installments integer not null,
    next_installment_date Date,
    end_date Date,
    loan_type varchar(256) not null,
    created_at timestamp not null,
    updated_at timestamp not null

);

create table payment(

    payment_id uuid default uuid_generate_v4() primary key unique not null,
    loan_id uuid not null,
    amount_paid numeric(15, 2),
    payment_date timestamp,
    created_at timestamp,
    updated_at timestamp,
    constraint fk_loan_id foreign key (loan_id) references loan(loan_id) on delete cascade

);