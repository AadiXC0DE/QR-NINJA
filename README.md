# QR-NINJA

QR-NINJA is a web application built with Next.js, qrcode.react, Tailwind CSS, React Particles, and a backend using Go, Gin, and PostgreSQL to store QR data. It allows users to generate QR codes quickly and easily and store them securely in a database.

## Features

- Generate QR codes for various types of data, such as text, URLs, email addresses, phone numbers, and more.
- Automatically saves generated QR codes to the local storage for easy access.
- Backend support to store, fetch, and delete QR codes.
- Clean and intuitive user interface.
- Responsive design for seamless usage on different devices.

## Frontend Installation

1. Clone the repository:

```sh
git clone https://github.com/AadiXC0DE/QR-NINJA.git
```

2. Navigate to the project directory:

```sh
cd qrninja
```

3. Install the dependencies:

```sh
npm install
```

4. Start the development server:

```sh
npm run dev
```

5. Open your web browser and visit `http://localhost:3000` to access QR-NINJA.

## Backend Installation

1. Navigate to the backend directory:

```sh
cd qrninja/backend
```

2. Create a `.env` file in the `backend` directory and add your database credentials:

```env
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=qrninja
DB_HOST=localhost
DB_PORT=5432
```

3. Install Go dependencies:

```sh
go mod tidy
```

4. Start the backend server:

```sh
go run main.go
```

The backend server will start on `http://localhost:8081`.

## API Routes

### Store QR Code
- **Endpoint:** `POST /qr`
- **Description:** Stores a QR code.
- **Request Body:**
  ```json
  {
    "userId": "string",
    "uuid": "string",
    "url": "string",
    "date": "string",
    "image": "string"
  }
  ```
- **Response:**
  ```json
  {
    "ID": "int",
    "CreatedAt": "string",
    "UpdatedAt": "string",
    "DeletedAt": "string|null",
    "userId": "string",
    "uuid": "string",
    "url": "string",
    "date": "string",
    "image": "string"
  }
  ```

### Fetch QR Codes
- **Endpoint:** `GET /qr/:userId`
- **Description:** Fetches all QR codes for a specific user.
- **Response:**
  ```json
  [
    {
      "ID": "int",
      "CreatedAt": "string",
      "UpdatedAt": "string",
      "DeletedAt": "string|null",
      "userId": "string",
      "uuid": "string",
      "url": "string",
      "date": "string",
      "image": "string"
    }
  ]
  ```

### Delete QR Code
- **Endpoint:** `DELETE /qr/:userId/:uuid`
- **Description:** Deletes a specific QR code for a user.
- **Response:**
  ```json
  {
    "message": "record deleted"
  }
  ```

## Technologies Used

### Frontend

- [Next.js](https://nextjs.org) - A React framework for server-rendered applications.
- [qrcode.react](https://www.npmjs.com/package/qrcode.react) - A React component to generate QR codes.
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework for rapid UI development.
- [React Particles](https://www.npmjs.com/package/react-particles-js) - A React component for creating animated particles backgrounds.

### Backend

- [Go](https://golang.org) - The programming language used for backend development.
- [Gin](https://github.com/gin-gonic/gin) - A web framework for Go.
- [Gorm](https://gorm.io) - An ORM library for Go.
- [PostgreSQL](https://www.postgresql.org) - A powerful, open-source object-relational database system.
- [Docker](https://www.docker.com) - Container platform to run the backend and PostgreSQL.

## Contributing

Contributions to QR-NINJA are welcome! If you find any bugs or have suggestions for improvement, please open an issue on the [GitHub repository](https://github.com/AadiXC0DE/QR-NINJA/issues). If you'd like to contribute code, you can fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
```

### Makefile Usage

1. **Install dependencies:**
   ```sh
   make install
   ```

2. **Start the services:**
   ```sh
   make start
   ```

3. **Start the frontend only:**
   ```sh
   make frontend-start
   ```

4. **Start the backend only:**
   ```sh
   make backend-start
   ```

5. **Bring up Docker services:**
   ```sh
   make docker-up
   ```

6. **Bring down Docker services:**
   ```sh
   make docker-down
   ```

