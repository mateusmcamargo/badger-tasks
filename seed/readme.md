# how to run the scripts

## With PgAdmin4

1. Open pgAdmin and connect to your database
2. In the left panel, find your database and right-click it → Query Tool
3. Paste the script in the query editor
4. Press F5 or click the '▶' Execute button

## With Docker

1. copy the script into the container
docker cp <script_name>.sql <container_name>:/<script_name>.sql

2. execute it
docker exec -it <container_name> psql -U <db_user> -d <db_name> -f /<script_name>.sql

> Alternatively, run directly from psql inside the container:
docker exec -it <container_name> psql -U <db_user> -d <db_name>

Then paste the SQL directly and hit Enter.

# Quick reference for loggin in after seeding users

| Role    | Name           | Email              | Area         | RA      | Password |
|---------|----------------|--------------------|--------------|---------|----------|
| Captain | Ana Silva      | ana@badger.com     | —            | 1111111 | 123456   |
| Manager | Bruno Costa    | bruno@badger.com   | Aerodynamics | 1222222 | 123456   |
| Manager | Camila Rocha   | camila@badger.com  | Dynamics     | 1333333 | 123456   |
| Manager | Diego Mendes   | diego@badger.com   | Telemetry    | 1444444 | 123456   |
| Manager | Elisa Barros   | elisa@badger.com   | Marketing    | 1555555 | 123456   |
| Manager | Felipe Azevedo | felipe@badger.com  | Structure    | 1666666 | 123456   |
| Leader  | Gabriela Lima  | gabriela@badger.com| Aerodynamics | 1777777 | 123456   |
| Leader  | Henrique Pinto | henrique@badger.com| Dynamics     | 1888888 | 123456   |
| Leader  | Isabela Nunes  | isabela@badger.com | Telemetry    | 1999999 | 123456   |
| Leader  | Joao Ferreira  | joao@badger.com    | Marketing    | 2111111 | 123456   |
| Leader  | Karen Souza    | karen@badger.com   | Structure    | 2222222 | 123456   |

> All passwords are '123456'