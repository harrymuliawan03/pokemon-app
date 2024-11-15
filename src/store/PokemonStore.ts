import {makeAutoObservable, runInAction} from 'mobx';
import axios from 'axios';
import {GetListPokemonService} from '../service/home.service';
import {PokemonModel} from '../models/pokemon.model';

class PokemonStore {
  pokemonData: PokemonModel[] = [];
  offset = 25;
  limit = 25;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchPokemon() {
    if (this.loading) return;

    this.loading = true;
    const data = await GetListPokemonService(this.limit, this.offset);

    const newPokemonData = await Promise.all(
      data.map(async pokemon => {
        const pokemonDetail = await axios.get(pokemon.url!);
        return {
          name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
          url: pokemon.url,
          imageUrl: pokemonDetail.data.sprites.front_default as string,
        };
      }),
    );

    runInAction(() => {
      this.pokemonData = [...this.pokemonData, ...newPokemonData];
      this.offset += 25;
      this.limit += 25;
      this.loading = false;
    });
  }
}

export const pokemonStore = new PokemonStore();
