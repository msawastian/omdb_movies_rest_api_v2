import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Movie } from "~entities/movie.entity";

@Injectable()
export class MoviesService {

  constructor(
    @InjectRepository(Movie)
    private movieRepo: Repository<Movie>
  ) {}

  async fetchAll(order: 'ASC' | 'DESC' = 'ASC'): Promise<Movie[]> {
    return this.movieRepo.find(
      {
        order: {
          title: order
        }
      }
    )
  }
}