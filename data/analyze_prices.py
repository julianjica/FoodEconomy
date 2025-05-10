import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
import warnings

warnings.filterwarnings("ignore")
# Load data
data = pd.read_csv("dummy.csv", parse_dates=["fechaCaptura"], dayfirst=True)

# Ensure datetime fields
data["fechaCaptura"] = pd.to_datetime(data["fechaCaptura"], errors="coerce")
data["fechaCreacion"] = pd.to_datetime(data["fechaCreacion"], errors="coerce")

# Extract year and month
data['año'] = data['fechaCaptura'].dt.year
data['month'] = data['fechaCaptura'].dt.month

# --- Compute Inflation per product-city pair (YoY %) ---
avg_price_by_year = (
    data.groupby(['producto', 'ciudad', 'año'])['precioPromedio']
    .mean()
    .unstack(fill_value=0)
)
yoy_inflation = avg_price_by_year.pct_change(axis=1) * 100
yoy_inflation.to_csv("outputs/inflation_by_product_city.csv")

# --- Sort for rolling metrics ---
data = data.sort_values(['producto', 'ciudad', 'fechaCaptura'])

# --- Compute Inflation per product-city pair (DoD %) ---
# Group by product and city, then calculate day-to-day inflation (% change)
data['daily_inflation'] = data.groupby(['producto', 'ciudad'])['precioPromedio'].pct_change() * 100

# Save to CSV
data[['producto', 'ciudad', 'fechaCaptura', 'precioPromedio', 'daily_inflation']].to_csv("outputs/daily_inflation.csv", index=False)


# --- Moving Averages and Volatility (per product-city pair) ---
short_window = 10
long_window = 50
vol_window = 30

data['short_ma'] = data.groupby(['producto', 'ciudad'])['precioPromedio'].transform(
    lambda x: x.rolling(window=short_window, min_periods=1).mean()
)
data['long_ma'] = data.groupby(['producto', 'ciudad'])['precioPromedio'].transform(
    lambda x: x.rolling(window=long_window, min_periods=1).mean()
)
data['volatility'] = data.groupby(['producto', 'ciudad'])['precioPromedio'].transform(
    lambda x: x.rolling(window=vol_window, min_periods=2).std()
)

# --- Detect crossover events ---
data['signal'] = 0
data.loc[data['short_ma'] > data['long_ma'], 'signal'] = 1
data['crossover'] = data.groupby(['producto', 'ciudad'])['signal'].diff()


# --- Momentum (RSI Calculation) ---
def compute_rsi(series, window=14):
    delta = series.diff()
    gain = pd.Series(np.where(delta > 0, delta, 0), index=series.index)
    loss = pd.Series(np.where(delta < 0, -delta, 0), index=series.index)

    gain = gain.rolling(window=window, min_periods=1).mean()
    loss = loss.rolling(window=window, min_periods=1).mean()

    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

data['RSI'] = data.groupby(['producto', 'ciudad'])['precioPromedio'].transform(lambda x: compute_rsi(x, window=14))

# Optional: flag high/low RSI conditions
data['rsi_signal'] = np.where(data['RSI'] > 70, 'Overbought',
                       np.where(data['RSI'] < 30, 'Oversold', 'Neutral'))


# --- Anomaly Detection using Rolling Z-Score ---
window_size = 50

data['z_score'] = data.groupby(['producto', 'ciudad'])['precioPromedio'].transform(
    lambda x: (x - x.rolling(window=window_size, min_periods=10).mean()) /
              x.rolling(window=window_size, min_periods=10).std(ddof=0)
)

# Mark as anomaly if z-score > 2 (or < -2)
data['anomaly'] = data['z_score'].abs() > 2


# --- Trend Analysis using ARIMA(p=50, d, q) ---

# Fitting p,q,d parameters
#def compute_arima_trend(series):
#    try:
#        # Fit ARIMA model with automated parameter selection
#        model = auto_arima(series, seasonal=False, stepwise=True, suppress_warnings=True, error_action='ignore')
#        # Forecast the next value
#        forecast = model.predict(n_periods=1)[0]
#        # Calculate the trend as the difference between forecast and last actual value
#        trend = forecast - series.iloc[-1]
#        return trend
#    except:
#        return np.nan

#Fix p, reduce search space for q,d



def compute_fast_trend_with_params(series, p, d, q):
    try:
        if len(series) < max(p, d, q) + 1:
            return np.nan  # Not enough data points to fit the model

        model = ARIMA(series, order=(p, d, q))
        model_fit = model.fit()
        forecast = model_fit.forecast(steps=1)[0]
        return forecast - series.iloc[-1]

    except Exception as e:
        print(f"Error in ARIMA fitting: {e}")
        return np.nan

# Function to retrieve the latest series data
def get_latest_series(producto, ciudad, full_data):
    subset = full_data[(full_data['producto'] == producto) & (full_data['ciudad'] == ciudad)]
    return subset['precioPromedio']

# Use parameters for fast forecast
def app_compute_trend(producto, ciudad, full_data, param_df):
    series = get_latest_series(producto, ciudad, full_data)
    
    match = param_df[(param_df['producto'] == producto) & (param_df['ciudad'] == ciudad)]
    
    if match.empty:
        return np.nan  # No parameters available for this combination
    
    # Extract parameters
    try:
        p = int(match['p'].values[0])
        d = int(match['d'].values[0])
        q = int(match['q'].values[0])
    except Exception as e:
        print(f"Error extracting parameters: {e}")
        return np.nan
    
    # Compute trend using parameters
    return compute_fast_trend_with_params(series, p, d, q)

# Load stored parameters
param_df = pd.read_csv('arima_trend_params.csv')

# Apply the trend computation
trend_results = (
    data.groupby(['producto', 'ciudad'])
    .apply(lambda group: app_compute_trend(group['producto'].iloc[0], group['ciudad'].iloc[0], data, param_df))
    .reset_index(name='trend_slope')
)

# Merge trend results back to the main DataFrame
data = data.merge(trend_results, on=['producto', 'ciudad'], how='left')

# Save the updated dataset with trend analysis
data.to_csv("outputs/trend_anomaly_analysis.csv", index=False)

# --- User-centric metrics: Price Drop Detection ---
data['prev_price'] = data.groupby(['producto', 'ciudad'])['precioPromedio'].shift(1)
data['price_drop'] = data['precioPromedio'] < data['prev_price']
price_drops = data[data['price_drop'] == True]
price_drops.to_csv("outputs/price_drops.csv", index=False)

# --- (Optional) Detect Seasonal Price Patterns ---
monthly_avg = (
    data.groupby(['producto', 'ciudad', 'month'])['precioPromedio']
    .mean()
    .reset_index()
)
monthly_avg.to_csv("outputs/seasonal_price_patterns.csv", index=False)

# Diagramas correlacion meses

print("✅ Analysis completed. Results saved to /outputs/")
print(data.head(20))

print(data.iloc[0:5, [1, 3,6,7,8,9,10,11,12]])  # first 5 rows, and 2nd & 4th columns


# heatmap_data = monthly_avg.pivot(index='producto', columns='month', values='precioPromedio')
# 
# import seaborn as sns
# import matplotlib.pyplot as plt
# 
# plt.figure(figsize=(12, 8))
# sns.heatmap(heatmap_data, cmap='YlGnBu', annot=True, fmt=".2f")
# plt.title('Average Monthly Prices per Product')
# plt.xlabel('Month')
# plt.ylabel('Product')
# plt.tight_layout()
# plt.show()
