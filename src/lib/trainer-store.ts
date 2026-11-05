import { useSyncExternalStore } from 'react'

export type SavedPokemon = {
  id: number
  name: string
  sprite: string
  types: string[]
  savedAt: number
}

export type Gender = 'chico' | 'chica' | 'otro'

export type Trainer = {
  id: string
  name: string
  region: string
  gender: Gender
  avatarId: number
  photo: string | null
  createdAt: number
  backpack: SavedPokemon[]
}

export type TrainerInput = {
  name: string
  region: string
  gender: Gender
  avatarId: number
  photo: string | null
}

type TrainerState = {
  trainers: Trainer[]
  activeTrainerId: string | null
}

const STORAGE_KEY = 'pokedex-trainers:v1'
const EMPTY_STATE: TrainerState = { trainers: [], activeTrainerId: null }

export const REGIONS = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Teselia', 'Kalos', 'Alola', 'Galar', 'Paldea']
export const AVATAR_IDS = [25, 1, 4, 7, 133, 152, 155, 158, 39, 52]
export const GENDERS: { value: Gender; label: string }[] = [
  { value: 'chico', label: 'Chico' },
  { value: 'chica', label: 'Chica' },
  { value: 'otro', label: 'Otro' },
]
export const DEFAULT_GENDER: Gender = 'otro'

export function genderLabel(gender: Gender) {
  return GENDERS.find((g) => g.value === gender)?.label ?? 'Otro'
}

function normalizeTrainer(raw: Partial<Trainer>): Trainer {
  return {
    id: raw.id ?? crypto.randomUUID(),
    name: raw.name ?? 'Entrenador',
    region: raw.region ?? REGIONS[0],
    gender: GENDERS.some((g) => g.value === raw.gender) ? (raw.gender as Gender) : DEFAULT_GENDER,
    avatarId: typeof raw.avatarId === 'number' ? raw.avatarId : AVATAR_IDS[0],
    photo: typeof raw.photo === 'string' ? raw.photo : null,
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : Date.now(),
    backpack: Array.isArray(raw.backpack) ? raw.backpack : [],
  }
}

function readStorage(): TrainerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_STATE
    const parsed = JSON.parse(raw) as TrainerState
    if (!Array.isArray(parsed.trainers)) return EMPTY_STATE
    return { trainers: parsed.trainers.map(normalizeTrainer), activeTrainerId: parsed.activeTrainerId ?? null }
  } catch {
    return EMPTY_STATE
  }
}

let state: TrainerState = readStorage()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function update(updater: (prev: TrainerState) => TrainerState) {
  const next = updater(state)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    throw new Error('No hay espacio suficiente en el navegador para guardar los cambios.')
  }
  state = next
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      state = readStorage()
      emit()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useTrainerStore() {
  const snapshot = useSyncExternalStore(subscribe, () => state)
  const activeTrainer = snapshot.trainers.find((t) => t.id === snapshot.activeTrainerId) ?? null
  return { ...snapshot, activeTrainer }
}

export function createTrainer(input: TrainerInput) {
  const trainer: Trainer = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    region: input.region,
    gender: input.gender,
    avatarId: input.avatarId,
    photo: input.photo,
    createdAt: Date.now(),
    backpack: [],
  }
  update((prev) => ({ trainers: [...prev.trainers, trainer], activeTrainerId: trainer.id }))
}

export function updateTrainer(id: string, input: TrainerInput) {
  update((prev) => ({
    ...prev,
    trainers: prev.trainers.map((t) => (t.id === id ? { ...t, ...input, name: input.name.trim() } : t)),
  }))
}

export function deleteTrainer(id: string) {
  update((prev) => {
    const trainers = prev.trainers.filter((t) => t.id !== id)
    const activeTrainerId = prev.activeTrainerId === id ? (trainers[0]?.id ?? null) : prev.activeTrainerId
    return { trainers, activeTrainerId }
  })
}

export function setActiveTrainer(id: string) {
  update((prev) => ({ ...prev, activeTrainerId: id }))
}

export function addToBackpack(pokemon: Omit<SavedPokemon, 'savedAt'>) {
  update((prev) => ({
    ...prev,
    trainers: prev.trainers.map((t) =>
      t.id === prev.activeTrainerId && !t.backpack.some((p) => p.id === pokemon.id)
        ? { ...t, backpack: [...t.backpack, { ...pokemon, savedAt: Date.now() }] }
        : t,
    ),
  }))
}

export function removeFromBackpack(pokemonId: number) {
  update((prev) => ({
    ...prev,
    trainers: prev.trainers.map((t) =>
      t.id === prev.activeTrainerId ? { ...t, backpack: t.backpack.filter((p) => p.id !== pokemonId) } : t,
    ),
  }))
}
