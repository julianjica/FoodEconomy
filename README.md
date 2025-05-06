# 🛒 Household Price Tracker & Recommender

This project aims to **web scrape historical prices** of essential household products and foods, **analyze their evolution over time**, and **recommend an optimized shopping list** based on price trends, inflation sensitivity, and user preferences. The final output is a **web-based dashboard** showcasing price evolution, insights, and smart buying suggestions.

---

## 🌟 Features

- 📊 Interactive dashboard with charts of price evolution  
- 🌍 Web scraping from online marketplaces and price archives  
- 🧠 Intelligent product recommendation engine  
- 📁 Historical data storage and analysis  
- 📆 Time-series visualization of inflation-sensitive products  
- 👤 Optional user profile for preference-based suggestions  

---

## ✅ Project Tasks

### 1. **Project Setup**
- [X] Set up GitHub repo and folder structure  
- [ ] Choose stack (suggested: Python, Flask/FastAPI, React or Streamlit, PostgreSQL/SQLite)  
- [ ] Create virtual environment and requirements.txt  

### 2. **Data Collection**
- [X] Identify sources for product price data (e.g., supermarkets, price-tracking websites, government inflation databases)  
- [ ] Implement web scrapers (using `BeautifulSoup`, `Scrapy`, or `Selenium`)  
- [ ] Store raw data (e.g., date, product name, category, price, source)  
- [ ] Schedule scraping jobs (e.g., with `cron` or `APScheduler`)  

### 3. **Data Storage**
- [ ] Design and set up a database schema  
- [ ] Implement data ingestion pipeline to clean and normalize prices  
- [ ] Store historical data with timestamps  

### 4. **Data Analysis**
- [ ] Compute inflation rate per product or category  
- [ ] Analyze trends and anomalies in pricing  
- [ ] Calculate moving averages and price volatility  
- [ ] Create user-centric metrics (e.g., price drops, seasonal changes)  

### 5. **Recommendation Engine**
- [ ] Define user personas or input preferences  
- [ ] Implement rule-based or ML-based product suggestion logic  
- [ ] Recommend best time to buy / best alternative products  

### 6. **Dashboard UI**
- [ ] Design front-end interface (charts, filters, input forms)  
- [ ] Create price trend graphs (e.g., using Chart.js, Recharts, or Plotly)  
- [ ] Display recommendations with rationale (e.g., “Buy rice now: lowest price in 6 months”)  
- [ ] Add export/share feature for shopping lists  

### 7. **Testing**
- [ ] Unit test scrapers and data pipeline  
- [ ] Test UI components and data accuracy  
- [ ] Handle edge cases (e.g., missing data, incorrect price formatting)  

### 8. **Deployment**
- [ ] Host backend API and frontend (e.g., on Vercel, Heroku, or AWS)  
- [ ] Set up database hosting  
- [ ] Enable scheduled jobs and monitoring  

---

## 📦 Tech Stack (Suggested)

- **Backend**: Python, FastAPI or Flask  
- **Frontend**: React.js or Streamlit  
- **Scraping**: BeautifulSoup, Scrapy, Selenium  
- **Data Analysis**: Pandas, NumPy, Scikit-learn (optional)  
- **Visualization**: Plotly, Chart.js, or Recharts  
- **Database**: PostgreSQL, SQLite  
- **Deployment**: Docker, Vercel/Heroku, GitHub Actions  

---

## 📌 Future Ideas

- Integration with online grocery APIs for live prices  
- Predictive pricing using machine learning  
- User authentication and saved preferences  
- Internationalization for different markets  

