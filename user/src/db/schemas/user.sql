create extension if not exists "uuid-ossp";

create table financial_data (
    financial_data_id uuid default uuid_generate_v4() primary key unique not null,
    credit_score integer,
    income numeric(15, 2),
    expenses numeric(15, 2)
);

create table users (
    user_id uuid default uuid_generate_v4() primary key unique not null,
    first_name varchar(256) not null,
    last_name varchar(256) not null,
    hashed_pass varchar(256) not null,
    email varchar(256) unique not null,
    address1 varchar(256) not null,
    phone_number varchar(256) not null,
    created_at timestamp not null,
    updated_at timestamp not null,
    financial_data_id uuid,
    constraint fk_financial_data_id foreign key (financial_data_id) references financial_data(financial_data_id) on delete cascade
);

