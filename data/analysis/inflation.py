import pandas as pd

def compute_yoy_inflation(data):
    # Compute YoY inflation per product-city pair
    avg_price_by_year = (
        data.groupby(['producto', 'ciudad', 'año'])['precioPromedio']
        .mean()
        .unstack(fill_value=0)
    )
    yoy_inflation = avg_price_by_year.pct_change(axis=1) * 100
    return yoy_inflation

def compute_daily_inflation(data):
    # Compute daily inflation per product-city pair
    data['daily_inflation'] = data.groupby(['producto', 'ciudad'])['precioPromedio'].pct_change() * 100
    return data
