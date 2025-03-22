FROM node:16-alpine

# Install build tools and Python 3 (needed for some node module compilation)
RUN apk add --no-cache --virtual .build-deps \
    build-base \
    python3

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create directory for ephemeris data
RUN mkdir -p /app/ephemeris

# Download Swiss Ephemeris files
RUN wget -P /app/ephemeris https://www.astro.com/ftp/swisseph/ephe/seas_18.se1 \
    && wget -P /app/ephemeris https://www.astro.com/ftp/swisseph/ephe/semo_18.se1 \
    && wget -P /app/ephemeris https://www.astro.com/ftp/swisseph/ephe/sepl_18.se1 \
    && wget -P /app/ephemeris https://www.astro.com/ftp/swisseph/ephe/seleapsec.txt

# Expose port
EXPOSE 4001

# Command to run the application
CMD ["npm", "start"]