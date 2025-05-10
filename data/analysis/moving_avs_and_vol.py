import pandas as pd

def add_moving_averages(data, short_window=10, long_window=50, vol_window=30):
    # Add short and long moving averages, and volatility
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
    
    return data
