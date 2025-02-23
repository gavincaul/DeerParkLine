import requests
import json

def get_weather():
    LAT, LON = 39.683723, -75.749657  # Deer Park, Lat and Long
    url = f"https://api.weather.gov/points/{LAT},{LON}"
    response = requests.get(url)
    
    if response.status_code == 200:
        forecast_url = response.json()["properties"]["forecast"]
        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json()

        today_forecast = forecast_data["properties"]["periods"][0]  # Now & Later Today
        print(today_forecast)
        return today_forecast
    else:
        return None

if __name__ == "__main__":
    print("Weather Now & Later Today:", get_weather())
