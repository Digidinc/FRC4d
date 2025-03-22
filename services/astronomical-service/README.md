# Astronomical Service API

RESTful API service that provides planetary positions, resonance calculations, and phase synchronization data for the FRC 4D Resonance Tool.

## Features

- **Planetary Positions**: Real-time and historical planetary positions using the Swiss Ephemeris library
- **Aspect Calculations**: Calculates planetary aspects with configurable orbs and strength metrics
- **Phase Synchronization**: Implements FRC phase synchronization equation (`dθᵢ/dt = ωᵢ + ∑ⱼKᵢⱼsin(θⱼ-θᵢ)`)
- **Resonance Strength**: Calculates resonance between planetary patterns and personal charts
- **Fractal Dimension**: Determines complexity of current resonance patterns
- **Caching System**: Redis-based caching for improved performance
- **Rate Limiting**: Prevents API abuse and ensures fair usage

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: Sequelize ORM with PostgreSQL
- **Caching**: Redis
- **Ephemeris**: Swiss Ephemeris library (swisseph)
- **Logging**: Winston logger with console and file transports
- **Authentication**: JWT-based authentication for API access

## Directory Structure

```
astronomical-service/
├── Dockerfile                # Container configuration
├── package.json              # Project dependencies
├── .env.example              # Example environment variables
├── src/
│   ├── app.js                # Main application entry point
│   ├── server.js             # Server initialization
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Express middleware
│   ├── models/               # Database models
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic
│   └── utils/                # Utility functions
│       ├── calculations.js   # Astronomical calculations
│       ├── logger.js         # Logging utility
│       ├── redis.js          # Redis cache utility
│       └── db.js             # Database utility
├── tests/                    # Test files
└── ephemeris/                # Swiss Ephemeris data files
```

## API Endpoints

### Planetary Positions

- `GET /planets`: Get current planetary positions
- `GET /planets/:date`: Get planetary positions for a specific date
- `GET /planets/extended`: Get extended planetary information

### Aspects

- `GET /aspects`: Get current planetary aspects
- `GET /aspects/:date`: Get aspects for a specific date
- `GET /aspects/strength/:threshold`: Get aspects with strength above threshold

### Calculations

- `POST /calculations/phase-sync`: Calculate phase synchronization
- `POST /calculations/resonance`: Calculate resonance strength
- `POST /calculations/fractal-dimension`: Calculate fractal dimension

### Charts

- `POST /natal-chart`: Generate a natal chart
- `GET /natal-chart/:id`: Get a saved natal chart
- `POST /transit-chart`: Calculate transit chart

## Setup Instructions

### Prerequisites

- Node.js 16+
- Redis
- PostgreSQL
- Swiss Ephemeris files

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/Digidinc/FRC4d.git
   cd FRC4d/services/astronomical-service
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Download Swiss Ephemeris files to `ephemeris/` directory:
   ```
   mkdir -p ephemeris
   cd ephemeris
   wget https://www.astro.com/ftp/swisseph/ephe/seas_18.se1
   wget https://www.astro.com/ftp/swisseph/ephe/semo_18.se1
   wget https://www.astro.com/ftp/swisseph/ephe/sepl_18.se1
   wget https://www.astro.com/ftp/swisseph/ephe/seleapsec.txt
   cd ..
   ```

4. Create .env file:
   ```
   cp .env.example .env
   ```

5. Update .env with your settings

6. Start development server:
   ```
   npm run dev
   ```

### Docker Deployment

1. Build the Docker image:
   ```
   docker build -t frc4d-astronomical-service .
   ```

2. Run the Docker container:
   ```
   docker run -p 4001:4001 --env-file .env frc4d-astronomical-service
   ```

## Implementation Details

The service implements the core mathematical formulas defined in the Vortex Foundation document:

### Phase Synchronization

The core equation for planetary vortex influence:
```
dθᵢ/dt = ωᵢ + ∑ⱼKᵢⱼsin(θⱼ-θᵢ)
```

Where:
- θᵢ represents the phase of vortex i
- ωᵢ is the natural frequency
- Kᵢⱼ is the coupling coefficient between vortices

### Resonance Strength

Formula for measuring resonance between patterns:
```
R(ΨA, ΨB) = |∫∫ω ΨA*(r,t,ω)ΨB(r,t,ω)drdω|²/∫∫ω|ΨA|²drdω∫∫ω|ΨB|²drdω
```

### Fractal Dimension

Box-counting algorithm for determining pattern complexity:
```
D = log(N(ε))/log(1/ε)
```

## License

© 2023 Fractal Resonance Consortium