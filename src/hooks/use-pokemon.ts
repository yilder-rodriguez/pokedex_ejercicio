import useSWR from 'swr'
import { fetchPokemon, type PokemonApiResponse } from '@/lib/pokemon'

export function usePokemon(query: string) {
  return useSWR<PokemonApiResponse>(['pokemon', query], () => fetchPokemon(query), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    keepPreviousData: true,
  })
}
