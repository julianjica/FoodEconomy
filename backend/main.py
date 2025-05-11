from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from typing import List, Optional
import os
from datetime import datetime, timedelta
import uvicorn

from pydantic import BaseModel

# Import analysis modules
import sys
sys.path.insert(0, "data")
from data_cleaning.clean_data import load_and_clean_data
from analysis.inflation import compute_daily_inflation
from analysis.moving_avs_and_vol import add_moving_averages
from analysis.anomalies import detect_anomalies
from analysis.trend import compute_trends, app_compute_trend
from analysis.user_metrics import detect_price_drops, detect_seasonal_patterns

app = FastAPI(title="Price Analysis API")

# Enable CORS to allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load and process data at startup
@app.on_event("startup")
async def startup_event():
    global data, products, cities, trend_params
    
    # Load and clean data
    data_path = "data/dummy.csv"  # Update with your actual data path
    
    try:
        data = load_and_clean_data(data_path)
        
        # Perform all necessary analysis
        data = compute_daily_inflation(data)
        data = add_moving_averages(data)
        data = detect_anomalies(data)
        
        # Load ARIMA parameters
        trend_params = pd.read_csv('data/parameters/arima_trend_params.csv')
        
        # Extract unique products and cities
        products = data['producto'].drop_duplicates().sort_values().tolist()
        cities = data['ciudad'].drop_duplicates().sort_values().tolist()
        
        print(f"Data loaded successfully. {len(products)} products and {len(cities)} cities.")
    except Exception as e:
        print(f"Error loading data: {e}")
        # Initialize with empty data as fallback
        data = pd.DataFrame()
        products = []
        cities = []
        trend_params = pd.DataFrame()

# Data models for API responses
class Product(BaseModel):
    id: int
    name: str

class PricePoint(BaseModel):
    month: str
    price: float
    inflation: float

class Recommendation(BaseModel):
    id: int
    product: str
    currentPrice: float
    trend: str  # 'alza', 'baja', 'estable'
    recommendation: str  # 'comprar', 'esperar', 'neutral'
    reason: str

# API endpoints
@app.get("/")
async def root():
    return {"message": "Price Analysis API is running"}

@app.get("/products", response_model=List[Product])
async def get_products():
    """Get list of all available products"""
    if not products:
        raise HTTPException(status_code=500, detail="Data not loaded properly")
    
    # Create product objects with IDs
    product_list = [Product(id=i, name=name) for i, name in enumerate(products)]
    return product_list

@app.get("/cities", response_model=List[str])
async def get_cities():
    """Get list of all available cities"""
    if not cities:
        raise HTTPException(status_code=500, detail="Data not loaded properly")
    
    return cities

@app.get("/price-data/{product_id}/{city}")
async def get_price_data(product_id: int, city: str):
    """Get price evolution data for a specific product and city"""
    if not products or not cities:
        raise HTTPException(status_code=500, detail="Data not loaded properly")
    
    if product_id < 0 or product_id >= len(products):
        raise HTTPException(status_code=404, detail="Product not found")
    
    if city not in cities:
        raise HTTPException(status_code=404, detail="City not found")
    
    product_name = products[product_id]
    
    # Filter data for the specific product and city
    filtered_data = data[(data['producto'] == product_name) & (data['ciudad'] == city)]
    
    if filtered_data.empty:
        raise HTTPException(status_code=404, detail="No data found for this product and city")
    
    # Group by month to get monthly averages
    filtered_data['month'] = filtered_data['fechaCaptura'].dt.strftime('%b')
    monthly_data = filtered_data.groupby('month').agg({
        'precioPromedio': 'mean',
        'daily_inflation': 'mean'
    }).reset_index()
    
    # Convert to the format expected by the frontend
    result = []
    for _, row in monthly_data.iterrows():
        result.append({
            "month": row['month'],
            "price": round(row['precioPromedio']),
            "inflation": round(row['daily_inflation'], 1)
        })
    
    return result

@app.get("/recommendations")
async def get_recommendations():
    """Get product purchase recommendations based on trends"""
    if data.empty:
        raise HTTPException(status_code=500, detail="Data not loaded properly")
    
    # Calculate trend for each product-city pair
    latest_data = data.sort_values('fechaCaptura').groupby(['producto', 'ciudad']).last().reset_index()
    
    # Identify products with significant trends
    recommendations = []
    
    # For simplicity, let's focus on data from one city (e.g., Bogotá)
    city_data = latest_data[latest_data['ciudad'] == "BOGOTÁ, D.C."]
    
    for i, (_, row) in enumerate(city_data.iterrows()):
        product_name = row['producto']
        current_price = row['precioPromedio']
        
        # Determine trend based on signal from moving averages
        if 'signal' in row and row['signal'] == 1:
            trend = "alza"
        elif 'signal' in row and row['signal'] == 0:
            trend = "baja"
        else:
            trend = "estable"
        
        # Determine recommendation based on trend
        if trend == "baja":
            recommendation = "comprar"
            reason = f"Se proyecta una caída en el precio del {product_name} en las próximas semanas."
        elif trend == "alza":
            recommendation = "esperar"
            reason = f"El precio del {product_name} está subiendo. Considere esperar o buscar alternativas."
        else:
            recommendation = "neutral"
            reason = f"El precio del {product_name} se mantiene estable. No hay ventaja en esperar para la compra."
        
        recommendations.append({
            "id": i,
            "product": product_name,
            "currentPrice": int(current_price),
            "trend": trend,
            "recommendation": recommendation,
            "reason": reason
        })
    
    # Return only 3 recommendations for simplicity
    return recommendations[:3]

@app.get("/product-detail/{product_id}")
async def get_product_detail(product_id: int):
    """Get detailed analysis for a specific product"""
    if not products:
        raise HTTPException(status_code=500, detail="Data not loaded properly")
    
    if product_id < 0 or product_id >= len(products):
        raise HTTPException(status_code=404, detail="Product not found")
    
    product_name = products[product_id]
    
    # Filter data for the specific product
    product_data = data[data['producto'] == product_name]
    
    if product_data.empty:
        raise HTTPException(status_code=404, detail="No data found for this product")
    
    # Calculate historical yearly data
    product_data['year'] = product_data['fechaCaptura'].dt.year
    yearly_data = product_data.groupby('year')['precioPromedio'].mean().reset_index()
    yearly_data = yearly_data.sort_values('year').tail(6)  # Last 6 years
    historical = [{"year": str(year), "price": int(price)} for year, price in zip(yearly_data['year'], yearly_data['precioPromedio'])]
    
    # Calculate city prices
    city_prices = product_data.groupby('ciudad')['precioPromedio'].mean().reset_index()
    city_prices = city_prices.sort_values('precioPromedio', ascending=False)
    city_price_data = [{"city": city, "price": int(price)} for city, price in zip(city_prices['ciudad'], city_prices['precioPromedio'])]
    
    # Calculate seasonality data
    product_data['month'] = product_data['fechaCaptura'].dt.strftime('%b')
    monthly_avg = product_data.groupby('month')['precioPromedio'].mean().reset_index()
    yearly_avg = product_data['precioPromedio'].mean()
    seasonality_data = []
    
    for _, row in monthly_avg.iterrows():
        index = int((row['precioPromedio'] / yearly_avg) * 100)
        seasonality_data.append({
            "month": row['month'],
            "index": index
        })
    
    return {
        "historicalData": historical,
        "cityPriceData": city_price_data,
        "seasonalityData": seasonality_data
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)