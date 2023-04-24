require('dotenv').config();

const config = {
    connectionString : process.env.db_url
}

module.exports = config