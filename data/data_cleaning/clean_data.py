import pandas as pd
import numpy as np

def load_and_clean_data(filepath):
    """
    Loads the data, cleans it by ensuring correct data types and handles missing values.
    Args:
        filepath (str): Path to the raw CSV file to be cleaned.
    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    # Load data
    data = pd.read_csv(filepath, parse_dates=["fechaCaptura", "fechaCreacion"], dayfirst=True)

    # Ensure datetime fields are correctly parsed
    data["fechaCaptura"] = pd.to_datetime(data["fechaCaptura"], errors="coerce")
    data["fechaCreacion"] = pd.to_datetime(data["fechaCreacion"], errors="coerce")
    
    # Extract year and month from fechaCaptura
    data['año'] = data['fechaCaptura'].dt.year
    data['mes'] = data['fechaCaptura'].dt.month
    
    # Remove rows with any essential columns being NaT or NaN
    data.dropna(subset=['fechaCaptura', 'producto', 'ciudad', 'precioPromedio'], inplace=True)

    # Remove duplicates (if any)
    data.drop_duplicates(inplace=True)
    
    # Handle missing or erroneous price data (you can fill, interpolate or drop)
    data['precioPromedio'] = data['precioPromedio'].replace(0, np.nan)
    data['precioPromedio'] = data['precioPromedio'].ffill()

    # Handle any other necessary cleaning steps here (e.g., erroneous product/city data)
    data = clean_product_and_city(data)

    # Sort the data by product, city, and capture date
    data.sort_values(by=['producto', 'ciudad', 'fechaCaptura'], ascending=[True, True, True], inplace=True)

    return data

def clean_product_and_city(data):
    """
    Cleans product and city columns to ensure consistent values and remove invalid entries.
    Args:
        data (pd.DataFrame): DataFrame to be cleaned.
    Returns:
        pd.DataFrame: DataFrame with cleaned product and city columns.
    """
    # Remove rows with invalid product or city entries (empty, null, or non-sensible values)
    data = data[data['producto'].notnull() & data['ciudad'].notnull()]
    data = data[data['producto'].str.strip() != '']
    data = data[data['ciudad'].str.strip() != '']
    
    # standardize product and city names
    data['producto'] = data['producto'].str.strip().str.lower()
    data['ciudad'] = data['ciudad'].str.strip().str.lower()

    return data

def save_cleaned_data(data, output_filepath):
    """
    Save the cleaned data to a specified file.
    Args:
        data (pd.DataFrame): Cleaned data.
        output_filepath (str): Path where the cleaned data will be saved.
    """
    data.to_csv(output_filepath, index=False)

# Example usage
if __name__ == "__main__":
    raw_data_filepath = 'data/raw/dummy.csv'  # Path to the raw data
    cleaned_data_filepath = 'data/processed/cleaned_data.csv'  # Path to save the cleaned data
    
    cleaned_data = load_and_clean_data(raw_data_filepath)
    save_cleaned_data(cleaned_data, cleaned_data_filepath)
    print(f"Data cleaned and saved to {cleaned_data_filepath}")
