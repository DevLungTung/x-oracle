# Production stage
FROM node:20-slim

WORKDIR /src

RUN apt update && apt install -y git

# Copy built files from builder stage
COPY . .

# Install production dependencies only
RUN yarn

RUN yarn build

# Set the entrypoint
ENTRYPOINT ["yarn", "start"]