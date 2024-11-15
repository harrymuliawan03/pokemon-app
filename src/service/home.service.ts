import {getData} from '../api/api';
import {PokemonModel} from '../models/pokemon.model';

export const GetListPokemonService = async (
  limit?: number,
  offset?: number,
): Promise<PokemonModel[]> => {
  const res = await getData(`pokemon?limit=${limit}&offset=${offset}`);
  if (res.results) {
    return res.results;
  }
  return [];
};
