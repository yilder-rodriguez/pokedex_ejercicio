export type PokemonApiResponse = {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  types: { slot: number; type: { name: string } }[]
  abilities: { is_hidden: boolean; ability: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  sprites: {
    front_default: string | null
    front_shiny: string | null
    back_default: string | null
    back_shiny: string | null
    other?: {
      home?: { front_default: string | null; front_shiny: string | null }
      'official-artwork'?: { front_default: string | null; front_shiny?: string | null }
    }
  }
}

export class PokemonNotFoundError extends Error {}

export const MAX_POKEMON_ID = 1025

export function normalizeQuery(raw: string) {
  const cleaned = raw.trim().toLowerCase().replace(/^#/, '').replace(/\s+/g, '-')
  if (/^\d+$/.test(cleaned)) return String(Number(cleaned))
  return cleaned
}

export async function fetchPokemon(query: string): Promise<PokemonApiResponse> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`)
  if (res.status === 404) throw new PokemonNotFoundError(query)
  if (!res.ok) throw new Error(`Error ${res.status} al consultar la PokéAPI`)
  return res.json()
}

export function getArtwork(p: PokemonApiResponse) {
  return p.sprites.other?.['official-artwork']?.front_default ?? p.sprites.front_default ?? ''
}

export function getImageCandidates(p: PokemonApiResponse, { shiny, back }: { shiny: boolean; back: boolean }) {
  const s = p.sprites
  const list = back
    ? [shiny ? s.back_shiny : s.back_default]
    : shiny
      ? [s.other?.home?.front_shiny, s.other?.['official-artwork']?.front_shiny, s.front_shiny]
      : [s.other?.home?.front_default, s.other?.['official-artwork']?.front_default, s.front_default]
  return list.filter((url): url is string => Boolean(url))
}

export function isPixelSprite(url: string) {
  return !url.includes('/other/')
}

export const TYPE_COLORS: Record<string, string> = {
  normal: '#a8a77a',
  fire: '#ee8130',
  water: '#6390f0',
  electric: '#f7d02c',
  grass: '#7ac74c',
  ice: '#96d9d6',
  fighting: '#c22e28',
  poison: '#a33ea1',
  ground: '#e2bf65',
  flying: '#a98ff3',
  psychic: '#f95587',
  bug: '#a6b91a',
  rock: '#b6a136',
  ghost: '#735797',
  dragon: '#6f35fc',
  dark: '#705746',
  steel: '#b7b7ce',
  fairy: '#d685ad',
}

export function getTypeColor(p: PokemonApiResponse) {
  return TYPE_COLORS[p.types[0]?.type.name ?? ''] ?? '#ef4444'
}

export function spriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

export function formatNumber(id: number) {
  return `#${String(id).padStart(4, '0')}`
}

export function capitalize(name: string) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const TYPE_STYLES: Record<string, { label: string; className: string }> = {
  normal: { label: 'Normal', className: 'bg-stone-400 text-white' },
  fire: { label: 'Fuego', className: 'bg-orange-500 text-white' },
  water: { label: 'Agua', className: 'bg-blue-500 text-white' },
  electric: { label: 'Eléctrico', className: 'bg-yellow-400 text-yellow-950' },
  grass: { label: 'Planta', className: 'bg-green-500 text-white' },
  ice: { label: 'Hielo', className: 'bg-cyan-300 text-cyan-950' },
  fighting: { label: 'Lucha', className: 'bg-red-700 text-white' },
  poison: { label: 'Veneno', className: 'bg-purple-500 text-white' },
  ground: { label: 'Tierra', className: 'bg-amber-600 text-white' },
  flying: { label: 'Volador', className: 'bg-indigo-400 text-white' },
  psychic: { label: 'Psíquico', className: 'bg-pink-500 text-white' },
  bug: { label: 'Bicho', className: 'bg-lime-500 text-lime-950' },
  rock: { label: 'Roca', className: 'bg-yellow-700 text-white' },
  ghost: { label: 'Fantasma', className: 'bg-violet-700 text-white' },
  dragon: { label: 'Dragón', className: 'bg-indigo-700 text-white' },
  dark: { label: 'Siniestro', className: 'bg-neutral-700 text-white' },
  steel: { label: 'Acero', className: 'bg-slate-400 text-white' },
  fairy: { label: 'Hada', className: 'bg-pink-300 text-pink-950' },
}

export const STAT_LABELS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
}
