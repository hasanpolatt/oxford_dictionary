## Setup

### Requirements

- Node.js (18.x or higher)
- npm or yarn
- MongoDB

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/hasanpolatt/oxford_app.git
   cd oxford_app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file and add your MongoDB connection details:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. Start the application:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3010 in your browser.

### Running with Docker

1. Ensure Docker and Docker Compose are installed.

2. Create a `.env.local` file and add your MongoDB connection details.

3. Build and start the Docker containers:
   ```bash
   docker-compose up --build
   ```

4. Open http://localhost:3010 in your browser.
