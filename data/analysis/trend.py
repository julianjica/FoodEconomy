import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import traceback
import numpy as np

def compute_fast_trend_with_params(series, p, d, q):
    # ARIMA-based trend computation
    try:
        model = ARIMA(series, order=(p, d, q))
        model_fit = model.fit()
        forecast = model_fit.forecast(steps=1).iloc[0]
        return forecast - series.iloc[-1]
    except Exception as e:
        print(f"Error in ARIMA fitting: {e}")
        traceback.print_exc()
        return np.nan

def get_latest_series(producto, ciudad, full_data):
    # Retrieve the latest series for a product-city pair
    subset = full_data[(full_data['producto'] == producto) & (full_data['ciudad'] == ciudad)]
    return subset['precioPromedio']

def app_compute_trend(producto, ciudad, full_data, param_df):
    # Apply the ARIMA-based trend computation
    series = get_latest_series(producto, ciudad, full_data)
    match = param_df[(param_df['producto'] == producto) & (param_df['ciudad'] == ciudad)]
    
    if match.empty:
        return np.nan  # No parameters available for this combination
    
    # Extract ARIMA parameters (p, d, q)
    try:
        p = int(match['p'].values[0])
        d = int(match['d'].values[0])
        q = int(match['q'].values[0])
    except Exception as e:
        print(f"Error extracting parameters: {e}")
        return np.nan
    
    # Compute trend
    return compute_fast_trend_with_params(series, p, d, q)


def compute_trends(df: pd.DataFrame, param_path: str = "data/parameters/arima_trend_params.csv") -> pd.DataFrame:
    """
    Computes ARIMA-based trend slope per (producto, ciudad) using pre-estimated ARIMA parameters.
    
    Args:
        df: The input DataFrame with at least ['producto', 'ciudad', 'precioPromedio'] columns.
        param_path: Path to the CSV containing ARIMA parameters per product-city pair.

    Returns:
        DataFrame with new column `trend_slope` merged in.
    """
    # Load ARIMA parameters
    param_df = pd.read_csv(param_path)

    # Apply trend computation per group
    trend_results = (
        df.groupby(['producto', 'ciudad'])
        .apply(lambda group: app_compute_trend(group['producto'].iloc[0],
                                               group['ciudad'].iloc[0],
                                               df,
                                               param_df))
        .reset_index(name='trend_slope')
    )

    # Merge back to main DataFrame
    df = df.merge(trend_results, on=['producto', 'ciudad'], how='left')

    return df