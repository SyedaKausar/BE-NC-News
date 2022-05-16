files to add to connect to the two databases:
.env. files

Instructions on how to create environment variables

The database connection settings can be set using environment variables:
`PGDATABASE=my_database_name node db/index.js`
Accepted environment variables include `PGDATABASE, PGUSER,PGPASSWORD, PGHOST, & PGPORT`.
If no `PGDATABASE` environment variable is set, `node-postgres` will connect to the default database.
