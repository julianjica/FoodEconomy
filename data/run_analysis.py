import pandas as pd

from analysis.inflation import compute_daily_inflation
from analysis.moving_avs_and_vol import add_moving_averages
from analysis.anomalies import detect_anomalies
from analysis.trend import compute_trends
from analysis.user_metrics import detect_price_drops, detect_seasonal_patterns

def run():
    df = pd.read_csv("data/processed/cleaned_data.csv", parse_dates=["fechaCaptura"])
    df = compute_daily_inflation(df)
    df = add_moving_averages(df)
    df = detect_anomalies(df)
    df = compute_trends(df)
    df = detect_price_drops(df)
    df = detect_seasonal_patterns(df)
    df.to_csv("data/processed/full_analysis.csv", index=False)

if __name__ == "__main__":
    run()
