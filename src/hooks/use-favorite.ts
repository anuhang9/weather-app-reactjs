import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

interface FavoriteCity{
    id: string;
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
    addedAt: number;
}
export function useFavorite(){
    const [favorite, setFavorite] = useLocalStorage<FavoriteCity[]>("favorite", [])
    const queryClient = useQueryClient();
    const favoriteQuery = useQuery({
        queryKey: ["favorite"],
        queryFn: ()=> favorite,
        staleTime: Infinity,
        initialData: favorite
    })
    const addFavorite = useMutation({
        mutationFn: async(city: Omit<FavoriteCity, "id" | "addedAt">)=>{
            const newFavorite: FavoriteCity = {
                ...city, id: `${city.lat}-${city.lon}`, addedAt: Date.now()
            }
            const exists = favorite.some((fav)=>fav.id === newFavorite.id);
            if(exists) return favorite;
            const newFavorites = [...favorite, newFavorite]
            setFavorite(newFavorites)
            return newFavorites;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: ["favorite"],
            });
        }
    })
    const removeFavorite = useMutation({
        mutationFn: async(cityId: string)=>{
            const newFavorites = favorite.filter((city)=>city.id !== cityId)
            setFavorite(newFavorites)
            return newFavorites
        },
        onSuccess: ()=>{
           queryClient.invalidateQueries({
                queryKey: ["favorite"],
            });
        }
    })
    return {favorites: favoriteQuery.data, addFavorite, removeFavorite, isFavorite: (lat: number, lon: number)=> favorite.some((city)=> city.lat === lat && city.lon === lon)}
}