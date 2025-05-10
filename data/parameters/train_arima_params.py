from pmdarima import auto_arima
import pandas as pd
import numpy as np
import warnings
import traceback


warnings.filterwarnings("ignore")
data = pd.read_csv("dummy.csv", parse_dates=["fechaCaptura"], dayfirst=True)
data = data.sort_values(['producto', 'ciudad', 'fechaCaptura'])

# Number of unique cities
num_cities = data['ciudad'].nunique()

# Number of unique products
num_products = data['producto'].nunique()

# Number of unique (city, product) pairs
num_city_product_pairs = data[['ciudad', 'producto']].drop_duplicates().shape[0]

print(f"Unique cities: {num_cities}")
print(f"Unique products: {num_products}")
print(f"Unique city-product pairs: {num_city_product_pairs}")


def compute_arima_trend_and_params(series):
    if not hasattr(compute_arima_trend_and_params, "call_count"):
        compute_arima_trend_and_params.call_count = 0

    # Increment the counter
    compute_arima_trend_and_params.call_count += 1
    print(f"\nFunction call #{compute_arima_trend_and_params.call_count}")

    try:
        # Fit ARIMA, letting it select d (limited to 0 or 1) and q, but p is fixed
        model = auto_arima(
            series,
            start_p=5,
            max_p=10,
            start_q=0,
            max_q=5,
            d=None,         # Let auto_arima decide
            max_d=1,        # Limit differencing to 1
            seasonal=False,
            stepwise=True,
            suppress_warnings=True,
            error_action='warn'
        )

        # Forecast the next period
        forecast = model.predict(n_periods=1)
        trend = forecast.iloc[0] - series.iloc[-1]

        # Extract ARIMA order (p, d, q)
        p, d, q = model.order

        return {'trend_slope': trend, 'p': p, 'd': d, 'q': q}
    
    except Exception as e:
        print("Error processing series:")
        traceback.print_exc()  # This prints the full error stack trace
        print("Series preview:", series.head())
        print("Series length:", len(series))
        print("Series unique values:", series.unique())
        return {'trend_slope': np.nan, 'p': None, 'd': None, 'q': None}


# Optional: limit to a few city-product pairs
n_test = 5
test_keys = data[['producto', 'ciudad']].drop_duplicates().head(n_test)
filtered_data = data.merge(test_keys, on=['producto', 'ciudad'])

# try:
#     # Store results manually per group
#     results = []
#     
#     for (producto, ciudad), group in filtered_data.groupby(['producto', 'ciudad']):
#         series = group['precioPromedio']
#         result = compute_arima_trend_and_params(series)
#         result['producto'] = producto
#         result['ciudad'] = ciudad
#         results.append(result)
#     
#     # Build proper DataFrame
#     trend_results = pd.DataFrame(results)
#     
#     # Reorder columns if needed
#     trend_results = trend_results[['producto', 'ciudad', 'trend_slope', 'p', 'd', 'q']]
#     
#     # Save
#     trend_results.to_csv('arima_trend_params.csv', index=False)
#     print(trend_results.head())
# 
# 
# except Exception as e:
#     print(f"Error in data processing: {e}")


try:
# Apply ARIMA parameter computation
    # Store results manually per group
    results = []
    
    for (producto, ciudad), group in data.groupby(['producto', 'ciudad']):
        series = group['precioPromedio']
        result = compute_arima_trend_and_params(series)
        result['producto'] = producto
        result['ciudad'] = ciudad
        results.append(result)
    
    # Build proper DataFrame
    trend_results = pd.DataFrame(results)
    
    # Reorder columns if needed
    trend_results = trend_results[['producto', 'ciudad', 'trend_slope', 'p', 'd', 'q']]
    
    # Save
    trend_results.to_csv('arima_trend_params.csv', index=False)
    print(trend_results.head())

except Exception as e:
    print(f"Error in data processing: {e}")
