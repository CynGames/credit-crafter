create extension if not exists "uuid-ossp";

create table states (
    state_id uuid default uuid_generate_v4() primary key unique not null,
    state_name varchar(256) not null
);

create table loan (

    loan_id uuid default uuid_generate_v4() primary key unique not null,
    user_id varchar(256) not null,
    approved_by uuid,
    amount numeric(15, 2),
    installments integer not null,
    next_installment_date Date,
    end_date Date,
    loan_type varchar(256) not null,
    state_id uuid not null, 
    created_at timestamp default current_timestamp not null,
    updated_at timestamp default current_timestamp not null,
    constraint fk_state_id foreign key (state_id) references states(state_id)

);


create table payment(

    payment_id uuid default uuid_generate_v4() primary key unique not null,
    loan_id uuid not null,
    amount_paid numeric(15, 2),
    created_at timestamp default current_timestamp not null,
    updated_at timestamp default current_timestamp not null,
    constraint fk_loan_id foreign key (loan_id) references loan(loan_id) on delete cascade

);

insert into states(state_name) values ('toReview');
insert into states(state_name) values ('Approved');
insert into states(state_name) values ('Denied');
insert into states(state_name) values ('Paid');
