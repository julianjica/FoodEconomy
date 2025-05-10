import pandas as pd

def detect_price_drops(data):
    # Detect price drops in the dataset
    data['prev_price'] = data.groupby(['producto', 'ciudad'])['precioPromedio'].shift(1)
    data['price_drop'] = data['precioPromedio'] < data['prev_price']
    price_drops = data[data['price_drop'] == True]
    return price_drops

def detect_seasonal_patterns(data):
    # Detect seasonal patterns based on monthly averages
    monthly_avg = (
        data.groupby(['producto', 'ciudad', 'mes'])['precioPromedio']
        .mean()
        .reset_index()
    )
        # Merge the monthly average back to the main data
    data = data.merge(monthly_avg, on=['producto', 'ciudad', 'mes'], how='left')

    return data
