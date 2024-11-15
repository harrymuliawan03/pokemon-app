type PokemonModel = {
  name: string;
  url?: string;
  imageUrl?: string;
};

type Stat = {
  base_stat: number;
  stat: {name: string};
};

type Ability = {
  ability: {name: string; url: string};
};

type SpriteImages = {
  front_default: string;
  dream_world: {front_default: string};
};

type AbilityData = {
  name: string;
  description: string;
};

type PokemonDataModel = {
  name: string;
  height: number;
  weight: number;
  imageUrl?: string;
  types: {type: {name: string}}[];
  stats: Stat[];
  abilities: AbilityData[];
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {front_default: string};
      dream_world: SpriteImages;
    };
  };
};

export type {PokemonModel, PokemonDataModel, AbilityData, Ability};
