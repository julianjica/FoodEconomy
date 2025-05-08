import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
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
print(avg_price_by_year.head(20))
yoy_inflation = avg_price_by_year.pct_change(axis=1) * 100
yoy_inflation.to_csv("outputs/inflation_by_product_city.csv")

# --- Sort for rolling metrics ---
data = data.sort_values(['producto', 'ciudad', 'fechaCaptura'])

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


# --- Anomaly Detection using Z-Score ---
# Add window=50
data['z_score'] = data.groupby(['producto', 'ciudad'])['precioPromedio'].transform(
    lambda x: (x - x.mean()) / x.std(ddof=0)
)
data['anomaly'] = data['z_score'].abs() > 2  # True if price deviates > 2 std dev

# --- Trendline Support (Simple Linear Regression Slope) ---
# Add window(p)=50, d, q  ARIMA, 

def compute_trend_slope(group):
    group = group.sort_values('fechaCaptura')
    X = np.arange(len(group)).reshape(-1, 1)
    y = group['precioPromedio'].values
    if len(y) >= 2:
        model = LinearRegression().fit(X, y)
        return model.coef_[0]
    else:
        return np.nan

trend_slopes = (
    data.groupby(['producto', 'ciudad'], group_keys=False)
        .apply(compute_trend_slope, include_groups=False)
        .reset_index(name='trend_slope')
)

data = data.merge(trend_slopes, on=['producto', 'ciudad'], how='left')

# Interpret trend slope
data['trend'] = np.where(data['trend_slope'] > 0, 'Uptrend',
                  np.where(data['trend_slope'] < 0, 'Downtrend', 'Flat'))

# --- Save results ---
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






