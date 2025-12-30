## Pairs Trading Dashboard

#### Evaluation of Cointegration and mean-reversion pairings for potential arbitrage opportunities. 

##### PROJECT OVERVIEW:

- Purpose: Identify stock pairings with strong cointegration p-values indicating strong mean-reversion long-term trends.
- Objective: Monitor 15 actively-traded pairs to detect divergence opportunities and generate automated long/short signals when spreads exceed ±2 standard deviations.
-Business Value: Provides a dashboard for real-time pairs trading signal monitoring, replacing manual spread analysis with automated statistical detection.

## Architecture
- **Backend**: AWS Lambda + S3 pipeline
- **Frontend**: Vanilla JavaScript + D3.js dashboard
- **Data Source**: Yahoo Finance API

## Features
- Real-time pairs trading signals
- Interactive time-series visualizations
- Statistical cointegration analysis
- Mobile-responsive design

##### TECHNOLOGIES USED:

**Backend & Data Pipeline:**
- **Python** - Lambda function development and data processing
- **AWS Lambda** - Serverless compute for scheduled data pipeline
- **AWS S3** - Cloud storage for JSON data artifacts
- **pandas/numpy** - Time-series analysis and statistical computation
- **yfinance** - Yahoo Finance API integration for market data
- **statsmodels** - Cointegration testing and econometric analysis

**Frontend & Visualization:**
- **JavaScript (ES6+)** - Asynchronous data fetching and DOM manipulation
- **D3.js v7** - Interactive time-series charts and heatmap visualizations
- **HTML5/CSS3** - Responsive layout with mobile-first design
- **Vanilla JS** - No frameworks for lightweight, fast-loading dashboard

**Development & Deployment:**
- **Git/GitHub** - Version control and project repository
- **GitHub Pages** - Static site hosting and deployment
- **Chrome DevTools** - Frontend debugging and performance optimization
- **AWS CloudWatch** - Lambda monitoring and scheduled triggers

## Backend Engineering

### Lambda Pipeline
- **Language**: Python
- **Trigger**: Scheduled (CloudWatch Events)
- **Data Source**: Yahoo Finance via yfinance
- **Output**: JSON files to S3

### Data Processing
1. Fetch daily price data for 15 equity pairs
2. Calculate z-scores and cointegration metrics
3. Generate trading signals (BUY/SELL/NO SIGNAL)
4. Export to S3 as structured JSON

### S3 Storage
- **Bucket**: `sector-corr-spreads`
- **Files**:
  - `current_signals.json` - Latest trading signals
  - `all_spreads.json` - Historical spread data
  - `signal_history.json` - Signal tracking over time

## Data Pipeline

Yahoo Finance API
       ↓
AWS Lambda (Python)
       ↓
Calculate Z-scores & Signals 
       ↓
S3 Bucket (JSON)
       ↓
Frontend (JavaScript)
       ↓
D3.js Visualizations


### LIVE PROJECT:
- View Full Analysis & Visualizations → https://sectorcorrpairs-production.up.railway.app/index.html
- Explore the complete project to review pairs trading analysis, cointegration observations and selection criteria.

CONTACT:

Ian Moore - Business Intelligence, Credit Risk and Financial Analytics Leader

📧 EMAIL: ian.moore@hey.com

💼 LinkedIn: https://www.linkedin.com/in/ian-moore-analytics/

🌐 Portfolio: https://www.ianmooreanalytics.com

Real-time statistical arbitrage dashboard with AWS Lambda backend and D3.js frontend for automated pairs trading signal generation.