CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    cpf VARCHAR(50) UNIQUE NOT NULL,
    hashed_password VARCHAR(500) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    is_agent BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE type_enum AS ENUM ('sell', 'rent');
CREATE TYPE property_type_enum AS ENUM ('house', 'apartment');


CREATE TABLE properties (
    property_id SERIAL PRIMARY KEY,
    available BOOLEAN DEFAULT FALSE,
    sell_or_rent type_enum DEFAULT 'sell',
    property_type property_type_enum DEFAULT 'apartment',
    title VARCHAR(20) NOT NULL,
    property_description VARCHAR(500),
    street VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    property_state VARCHAR(50) NOT NULL,
    furnished BOOLEAN DEFAULT FALSE,
    rooms INTEGER DEFAULT 0,
    suites INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    parking_space INTEGER DEFAULT 0,
    area NUMERIC NOT NULL,
    condominium_price NUMERIC DEFAULT 0,
    price NUMERIC NOT NULL,
    gym BOOLEAN DEFAULT FALSE,
    playground BOOLEAN DEFAULT FALSE,
    elevator BOOLEAN DEFAULT FALSE,
    gourmet_area BOOLEAN DEFAULT FALSE,
    sport_court BOOLEAN DEFAULT FALSE,
    water_pool BOOLEAN DEFAULT FALSE,
    warm_pool BOOLEAN DEFAULT FALSE,
    green_area BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    property_owner INTEGER REFERENCES users(id)
);

CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    property_id INTEGER REFERENCES properties(property_id)
);

CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    img_link VARCHAR(200) NOT NULL,
    property_id INTEGER REFERENCES properties(property_id)
);