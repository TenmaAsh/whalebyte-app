# WhaleByte Project

A decentralized platform for creating and joining spheres using blockchain technology.

## Features

- Connect your Ethereum wallet
- Create and join spheres
- Premium spheres with entry fees
- Modern Twitter-like UI
- Simulator mode for testing

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- MetaMask or another Ethereum wallet browser extension (not needed for simulator mode)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TenmaAsh/whalebyte-app.git
cd whalebyte-app
```

2. Install dependencies:
```bash
npm install
```

3. Run in simulator mode:
```bash
# Option 1: Using the simulator script
./simulator.sh

# Option 2: Using Node.js script
node run-simulator.js
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

## Testing in Simulator Mode

The simulator mode allows you to test the application without a real blockchain connection:

- No real wallet connection required
- Mock data for spheres and transactions
- Simulated blockchain operations
- Instant feedback for testing

### Features Available in Simulator:

1. **Wallet Connection**
   - Connect/disconnect wallet simulation
   - Mock wallet balance

2. **Spheres Management**
   - Create new spheres
   - Join existing spheres
   - Premium sphere interactions
   - View sphere details

3. **Transaction Simulation**
   - Join sphere transactions
   - Premium sphere entry fee handling
   - Transaction success/failure scenarios

## License

This project is licensed under the MIT License.