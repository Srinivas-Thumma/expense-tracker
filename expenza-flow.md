# Expenza —  Flow 

## Stack
Spring Boot (Java) + PostgreSQL backend · React (Vite) frontend · JWT auth (stateless)

## Data model (who owns what)
```
User ──< Category (mostly user=NULL → "global/master" categories, admin-managed)
User ──< Expense ──> Category
User ──< Income  ──> Category
User ──< Budget
User ──< Notification
```
- IDs are UUIDs (unguessable, not just "hard to guess" via `findByIdAndUserId`).
- **Categories are global, not personal.** Auto-seeded once (`AdminService.seedMasterCategories`, `@PostConstruct`, 10 defaults). Only admins can create/edit/delete them (`CategoryController` checks `ROLE_ADMIN`). Regular users only ever *select* from this shared list — no per-user category creation exists anywhere, even though the DB schema (`user_id` FK on `Category`) supports it.

## Auth flow
1. Register/Login → `AuthController` → BCrypt hash/verify password → `JwtService.generateToken(email, role)` (HMAC-SHA signed, 24h expiry, payload = email + role, **encoded not encrypted**)
2. Frontend `AuthContext.login()` → stores token + full user object in **localStorage** (`token`, `user` keys)
3. Every axios call → **request interceptor** (`api.js`) reads localStorage, attaches `Authorization: Bearer <token>`
4. Backend `JwtAuthenticationFilter` (runs once per request, before everything else) → strips `"Bearer "` (substring(7)) → verifies signature → sets `SecurityContextHolder` — **never queries the DB**, trusts the token's claims as-is
5. `SecurityConfig` rule chain (order matters, first match wins): OPTIONS→permitAll, `/profile-pictures/**`→permitAll, `/api/health`+`/api/auth/**`→permitAll, `/api/admin/**`→`hasRole(ADMIN)`, `/api/**`→`hasAnyRole(USER,ADMIN)`
6. Controller calls `UserService.currentUser(authentication)` → `authentication.getName()` (the email) → DB lookup for the real `User` row

## Add Expense — full loop
Click "Add Expense" → modal form → Save → `POST /api/expenses` (with JWT header) → filter validates token → `ExpenseController.create()` → `userService.currentUser()` → `apply()` validates category is a real global category (`findByIdAndUserIsNull`) → `expenseRepository.save()` (INSERT) → `financeService.checkBudget(user)` (sums expenses, compares to each budget, **stops at first exceeded one**, creates `Notification` + sends email via `EmailService`, failures swallowed silently) → JSON response → frontend closes modal, re-fetches list + categories, re-renders.

## Frontend route guarding (two layers)
- `ProtectedRoute` — only checks "is anyone logged in" (token exists) → else redirect `/login`
- `MainLayout` / `AdminLayout` — each checks the *opposite* role and bounces (`AdminLayout`→non-admin goes to `/dashboard`; `MainLayout`→admin goes to `/admin`)
- Landing (`/`) and Login (`/login`) sit outside `ProtectedRoute` entirely — public

## Known gaps / honest "not done yet" list
- No personal categories reachable via any endpoint (schema-only feature)
- No recurrence engine — `recurring`/`recurrenceType` fields stored, nothing auto-generates future entries
- Budget check only notifies about the *first* exceeded budget, not all
- No frontend handling of expired token mid-session (no response interceptor; `isAuthenticated` just checks token *exists*, not validity)
- `UploadController` is dead code — saves files but returns an unreachable `/uploads/...` URL (only `/profile-pictures/**` is actually served, via `WebConfig`)
- `Settings.jsx` (admin) is a non-functional mockup — local state only, no backend calls
- Secrets (DB password, JWT secret, Gmail app password) are plaintext in `application.properties` — rotate/move to env vars before anything public

## Design details worth being able to explain precisely
- `UUID` PKs prevent ID-guessing; `findByIdAndUserId` in every repo prevents cross-user data access even with a valid ID
- `FetchType.LAZY` on `Category` relations + `@EntityGraph` on `ExpenseRepository` (but NOT `IncomeRepository`) avoids/risks N+1 queries
- `hasRole("ADMIN")` matches because `Role` enum values are literally named `ROLE_ADMIN`/`ROLE_USER` — a naming coincidence the security check depends on
- `BigDecimal` for money (never `double`) — avoids floating-point rounding errors
- Vague `"Invalid credentials"` on both bad email and bad password — doesn't leak which emails are registered
- `deleteUser()` deletes child rows (notifications, budgets, income, expenses, categories) before the user row, in that order, to avoid FK constraint violations
