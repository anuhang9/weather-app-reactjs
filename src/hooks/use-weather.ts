import type { Coordinates } from "@/api/type";
import { weatherAPI } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEYS = {
    weather: (coords: Coordinates)=>["weather", coords] as const, // as const reffering array value must be "array" as string and coords value
    forecast: (coords: Coordinates)=>["forecast" ,coords] as const,
    location: (coords: Coordinates)=>["location", coords] as const,
    search: (query: string)=>["location-search", query] as const,
} as const;

export function useWeatherQuery(coordinates: Coordinates | null){
    return useQuery({
        queryKey: WEATHER_KEYS.weather(coordinates ?? {lat: 0, lon: 0}),
        queryFn: ()=>coordinates?weatherAPI.getCurrentWeather(coordinates): null,
        enabled: !!coordinates, // enabled is true when cordinates avilable
    })
}

export function useForecastQuery(coordinates: Coordinates | null){
    return useQuery({
        queryKey: WEATHER_KEYS.forecast(coordinates ?? {lat: 0, lon: 0}),
        queryFn: ()=>coordinates?weatherAPI.getForecast(coordinates): null,
        enabled: !!coordinates, // enabled is true when cordinates avilable
    })
}

export function useReverseGeocodeQuery(coordinates: Coordinates | null){
    return useQuery({
        queryKey: WEATHER_KEYS.location(coordinates ?? {lat: 0, lon: 0}),
        queryFn: ()=>coordinates?weatherAPI.reverseGeocode(coordinates): null,
        enabled: !!coordinates, // enabled is true when cordinates avilable
    })
}

export function useSearchLocationQuery(query: string){
    return useQuery({
        queryKey: WEATHER_KEYS.search(query),
        queryFn: ()=>weatherAPI.searchLocations(query),
        enabled: query.length>=3,
    })
}