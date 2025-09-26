import { CurrentWeather } from "@/components/current-weather";
import { FavoriteButton } from "@/components/favorite-button";
import { HourlyTemprature } from "@/components/hourly-temprature";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WeatherDetails } from "@/components/weather-details";
import { WeatherForecast } from "@/components/weather-forecast";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle } from "lucide-react";
import { useSearchParams, useParams, Link } from "react-router-dom"

export const CityPage =()=>{
    const [ searchParams] = useSearchParams();
    const params = useParams();
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lon = parseFloat(searchParams.get("lon") || "0");
    const coordinates = {lat, lon};
    const weatherQuery = useWeatherQuery(coordinates);
    const forecastQuery = useForecastQuery(coordinates)

      if(weatherQuery.error || forecastQuery.error){
    return(
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4"/>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            Faild to load weather Data. Please try again.
          </AlertDescription>
      </Alert>
    )
  }

  if(!weatherQuery.data || !forecastQuery.data || !params.cityName){
    return <LoadingSkeleton />
  }
    return(
        <div className="space-y-4">
      {/* favorite cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight"><Link  target="_blank" rel="noopener noreferrer" to={`https://google.com/search?q=${params.cityName}`}>{params.cityName}</Link><span className="text-xs text-muted-foreground px-2">{weatherQuery.data.sys.country}</span></h1>
        <div>
           <FavoriteButton data={{...weatherQuery.data, name: params.cityName}}/> 
        </div>
      </div>
      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <CurrentWeather data={weatherQuery.data}/>
          <HourlyTemprature data={forecastQuery.data}/> 
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data}/>
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
    )
}