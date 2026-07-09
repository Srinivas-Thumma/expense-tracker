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

## 5-Day Build Plan

### Day 1

- Run backend and frontend.
- Create login/register APIs.
- Connect frontend login form to backend.
- Store JWT token in frontend.

### Day 2

- Build categories, income, and expenses APIs.
- Add create/list/update/delete screens.

### Day 3

- Build dashboard totals.
- Add expense-by-category pie chart.
- Add budget APIs.

### Day 4

- Add reports.
- Add profile update.
- Add file upload for profile picture.

### Day 5

- Add email notifications.
- Test all workflows.
- Fix UI and bugs.

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

Health check:

```text
http://localhost:8080/api/health
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

## Beginner Notes

Build one feature at a time. Do not start with email, reports, or admin features.

Recommended order:

1. Login/register
2. Categories
3. Income
4. Expenses
5. Dashboard
6. Budget
7. Reports
8. Profile
9. Email notifications
