# Expense Tracker

Beginner-friendly full-stack expense tracker based on this stack:

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- React
- Axios
- Tailwind CSS
- Recharts

## Project Structure

```text
expense-tracker-v2/
  backend/
    src/main/java/com/expensetracker/
      auth/
      config/
      controller/
      dto/
      entity/
      repository/
      security/
      service/
    src/main/resources/application.properties
    pom.xml

  frontend/
    src/
      assets/
      components/
      context/
      hooks/
      pages/
      routes/
      services/
    package.json
```


## Backend Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE expense_tracker;
```

Update database username/password in:

```text
backend/src/main/resources/application.properties
```

Default settings are:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/expense_tracker
spring.datasource.username=postgres
spring.datasource.password=0000
```

If your PostgreSQL password is different, change `spring.datasource.password`.

Run backend:

```bash
cd backend
mvn spring-boot:run
```


## Backend Features

Implemented API modules:

- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Profile: `GET /api/profile`, `PUT /api/profile`
- Categories: `GET/POST/PUT/DELETE /api/categories`
- Income: `GET/POST/PUT/DELETE /api/income`
- Expenses: `GET/POST/PUT/DELETE /api/expenses`
- Budgets: `GET/POST/PUT/DELETE /api/budgets`
- Dashboard: `GET /api/dashboard`
- Reports: `GET /api/reports/monthly`
- Notifications: `GET /api/notifications`, `PUT /api/notifications/{id}/read`

When a user registers, default categories are created automatically:

- Income: Salary, Freelance
- Expense: Food, Rent, Travel, Shopping

## Common Backend Error

If you see this error:

```text
Unable to determine Dialect without JDBC metadata
```

It usually means Spring Boot could not connect to PostgreSQL.

Check these things:

1. PostgreSQL service is running.
2. Database `expense_tracker` exists.
3. Username/password in `application.properties` are correct.
4. PostgreSQL is listening on port `5432`.

On Windows, you can check the port with:

```powershell
Test-NetConnection localhost -Port 5432
```

If `TcpTestSucceeded` is `False`, PostgreSQL is not running or is not using port `5432`.

## Frontend Setup

Install dependencies:

```bash
cd frontend
npm install
```

Run frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Frontend Features

Implemented screens:

- Login and register
- Dashboard with totals and pie chart
- Categories CRUD
- Income CRUD
- Expenses CRUD
- Budget CRUD
- Monthly reports
- Profile update

## How To Try The App

1. Start PostgreSQL.
2. Create database `expense_tracker`.
3. Start backend:

```bash
cd backend
mvn spring-boot:run
```

4. Start frontend in another terminal:

```bash
cd frontend
npm run dev
```

5. Open `http://localhost:5173`.
6. Register a new account.
7. Add income, expenses, and budgets.

