import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonResponse, ArrayPokemonSeed } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel:Model<Pokemon>,
    private readonly http:AxiosAdapter
  ){}

  async executeSeed(){

    await this.pokemonModel.deleteMany(); // DELETE TODA LA TABLA

    const data = await this.http.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert:ArrayPokemonSeed[] = [];

    data.results.forEach(({name, url}) => {
      const segments = url.split('/')
      const no = +segments[segments.length - 2]
      pokemonToInsert.push({name, no})
    });

    await this.pokemonModel.insertMany(pokemonToInsert)

    return { message: 'Se inserto correctamente' };

    //SEGUNDA FORMA

    // const insertPromisesArray = [];

    // data.results.forEach(({name, url}) => {
    //   const segments = url.split('/')
    //   const no = +segments[segments.length - 2]
    //   // await this.pokemonModel.create({name, no})
    //   insertPromisesArray.push(
    //     this.pokemonModel.create({name, no})
    //   )
    // });

    // await Promise.all(insertPromisesArray);

    // return { message: 'Se inserto correctamente' };

  }

}
