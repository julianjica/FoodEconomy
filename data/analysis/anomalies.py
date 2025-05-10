import pandas as pd
import numpy as np

def detect_anomalies(data, window_size=50):
    # Z-score based anomaly detection
    data['z_score'] = data.groupby(['producto', 'ciudad'])['precioPromedio'].transform(
        lambda x: (x - x.rolling(window=window_size, min_periods=10).mean()) /
                  x.rolling(window=window_size, min_periods=10).std(ddof=0)
    )
    data['anomaly'] = data['z_score'].abs() > 2
    return data
