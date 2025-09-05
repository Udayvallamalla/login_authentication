# 🗄️ Database Schema Documentation

## Database Overview
- **Database Name**: `mine`
- **Host**: `localhost:3306`
- **Tables**: 3 tables total

---

## 🔐 AUTH_USERS Table (Authentication)

**Purpose**: Stores user authentication credentials and profile information

| Field      | Type         | Null | Key | Default             | Description                    |
|------------|--------------|------|-----|---------------------|--------------------------------|
| id         | varchar(36)  | NO   | PRI | null                | Primary key (UUID)             |
| username   | varchar(255) | NO   | UNI | null                | Unique username for login      |
| password   | varchar(255) | NO   |     | null                | Hashed password (bcrypt)       |
| email      | varchar(255) | YES  | UNI | null                | User email (optional, unique)  |
| fullName   | varchar(255) | YES  |     | null                | User's full name (optional)    |
| isActive   | tinyint(1)   | YES  |     | 1                   | Account status (1=active)      |
| lastLogin  | timestamp    | YES  |     | null                | Last login timestamp           |
| createdAt  | timestamp    | YES  |     | CURRENT_TIMESTAMP   | Account creation time          |
| updatedAt  | timestamp    | YES  |     | CURRENT_TIMESTAMP   | Last update time               |

### Current Data:
- **Total Records**: 2 users
- **Admin User**: username='admin', email='admin@example.com'
- **Regular User**: username='Uday', email='Udaysanny3@gmail.com'

---

## 📝 USERS Table (Form Data)

**Purpose**: Stores user form submissions from the application

| Field       | Type                          | Null | Key | Default             | Description                    |
|-------------|-------------------------------|------|-----|---------------------|--------------------------------|
| id          | varchar(36)                   | NO   | PRI | null                | Primary key (UUID)             |
| name        | varchar(255)                  | NO   |     | null                | User's full name               |
| gender      | enum('male','female','other') | NO   |     | null                | User's gender                  |
| email       | varchar(255)                  | NO   | UNI | null                | User email (unique)            |
| phoneNumber | varchar(20)                   | NO   |     | null                | User's phone number            |
| createdAt   | timestamp                     | YES  |     | CURRENT_TIMESTAMP   | Record creation time           |
| updatedAt   | timestamp                     | YES  |     | CURRENT_TIMESTAMP   | Last update time               |

### Current Data:
- **Total Records**: 2 users
- **User 1**: Uday Vallamalla (male, udayvallamalla1995@gmail.com)
- **User 2**: VALLAMALLA UDAY (male, Udaysanny3@gmail.com)

---

## 📊 STUDENT_DATA Table

**Purpose**: Legacy table (appears to be from previous setup)

*Note: This table exists but is not actively used by the current application.*

---

## 🔗 Table Relationships

```
AUTH_USERS (Authentication)
    ↓
    Used for login/authentication
    ↓
USERS (Form Data)
    ↓
    Stores form submissions after authentication
```

## 🔒 Security Features

### AUTH_USERS Security:
- **Password Hashing**: Uses bcrypt with salt rounds
- **Unique Constraints**: Username and email must be unique
- **Account Status**: isActive field for account management
- **Session Tracking**: lastLogin timestamp

### USERS Security:
- **Protected Routes**: All CRUD operations require authentication
- **Unique Email**: Prevents duplicate form submissions
- **Input Validation**: Server-side validation for all fields

## 📈 Database Statistics

| Table      | Records | Purpose                    |
|------------|---------|----------------------------|
| auth_users | 2       | Authentication & Login     |
| users      | 2       | Form Data Storage          |
| student_data| ?      | Legacy (not in use)        |

---

## 🚀 API Integration

### Authentication Flow:
1. User registers → Record created in `auth_users`
2. User logs in → JWT token generated
3. User accesses dashboard → Token validated
4. User submits form → Record created in `users` (requires auth)

### Protected Endpoints:
- `GET /api/users` - Requires authentication
- `POST /api/users` - Requires authentication  
- `PUT /api/users/:id` - Requires authentication
- `DELETE /api/users/:id` - Requires authentication

### Public Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/health` - Health check