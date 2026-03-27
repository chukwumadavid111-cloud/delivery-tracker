FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Build frontend
COPY frontend ./frontend
RUN cd frontend && npm run build

# Copy backend code
COPY backend ./backend

# Expose ports
EXPOSE 4000

# Set environment
ENV NODE_ENV=production

# Start backend (which serves frontend as static files)
CMD ["npm", "--prefix", "backend", "start"]
