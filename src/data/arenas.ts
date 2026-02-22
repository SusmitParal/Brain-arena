import { Arena } from '../types';

export const PVP_ARENAS: Arena[] = [
  {
    id: 'arena_delhi',
    name: 'Delight Delhi',
    slug: 'delhi',
    description: 'A vibrant battle of wits in the heart of India.',
    entryFee: 100,
    prizePool: 200,
    minLevel: 1,
    difficulty: 'Easy'
  },
  {
    id: 'arena_athens',
    name: 'Authentic Athens',
    slug: 'athens',
    description: 'Prove your wisdom in the cradle of civilization.',
    entryFee: 500,
    prizePool: 1000,
    minLevel: 3,
    difficulty: 'Easy'
  },
  {
    id: 'arena_london',
    name: 'Lively London',
    slug: 'london',
    description: 'A classic challenge across the Thames.',
    entryFee: 1000,
    prizePool: 2000,
    minLevel: 5,
    difficulty: 'Medium'
  },
  {
    id: 'arena_paris',
    name: 'Posh Paris',
    slug: 'paris',
    description: 'Elegant questions for the refined mind.',
    entryFee: 2500,
    prizePool: 5000,
    minLevel: 8,
    difficulty: 'Medium'
  },
  {
    id: 'arena_newyork',
    name: 'Neon New York',
    slug: 'newyork',
    description: 'Fast-paced trivia in the city that never sleeps.',
    entryFee: 5000,
    prizePool: 10000,
    minLevel: 10,
    difficulty: 'Medium'
  },
  {
    id: 'arena_tokyo',
    name: 'Techno Tokyo',
    slug: 'tokyo',
    description: 'Futuristic puzzles in a neon metropolis.',
    entryFee: 10000,
    prizePool: 20000,
    minLevel: 15,
    difficulty: 'Hard'
  },
  {
    id: 'arena_rio',
    name: 'Radiant Rio',
    slug: 'rio',
    description: 'Rhythmic riddles under the sun.',
    entryFee: 20000,
    prizePool: 40000,
    minLevel: 20,
    difficulty: 'Hard'
  },
  {
    id: 'arena_cairo',
    name: 'Classic Cairo',
    slug: 'cairo',
    description: 'Unearth ancient secrets in the desert sands.',
    entryFee: 50000,
    prizePool: 100000,
    minLevel: 25,
    difficulty: 'Hard'
  },
  {
    id: 'arena_sydney',
    name: 'Sunny Sydney',
    slug: 'sydney',
    description: 'Breezy questions from down under.',
    entryFee: 100000,
    prizePool: 200000,
    minLevel: 30,
    difficulty: 'Expert'
  },
  {
    id: 'arena_moscow',
    name: 'Majestic Moscow',
    slug: 'moscow',
    description: 'Cold logic is required to survive here.',
    entryFee: 250000,
    prizePool: 500000,
    minLevel: 40,
    difficulty: 'Expert'
  }
];
