create
    extension if not exists "uuid-ossp";

create table financial_data
(
    financial_data_id varchar primary key unique          not null,
    credit_score      integer,
    income            integer,
    expenses          integer,
    created_at        timestamp default current_timestamp not null,
    updated_at        timestamp default current_timestamp not null
);

create table users
(
    user_id           varchar primary key unique          not null,
    first_name        varchar(256)                        not null,
    last_name         varchar(256)                        not null,
    email             varchar(256) unique                 not null,
    roles             varchar(256)[]                      not null,
    created_at        timestamp default current_timestamp not null,
    updated_at        timestamp default current_timestamp not null,
    financial_data_id varchar,
    constraint fk_financial_data_id foreign key (financial_data_id) references financial_data (financial_data_id) on delete cascade
);
