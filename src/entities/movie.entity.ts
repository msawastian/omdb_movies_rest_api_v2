import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Expose, Exclude, classToPlain, plainToClass } from 'class-transformer';
import { Comment } from './comment.entity';
import { MovieDTO } from '../dtos/movie.dto';

@Entity()
export class Movie {
    @Expose()
    @PrimaryColumn()
    imdbID: string;

    @Exclude()
    @OneToMany(_ => Comment, comment => comment.movie, { lazy: true })
    comments: Promise<Comment[]>;

    @Expose()
    @Column()
    title: string;

    @Expose()
    @Column({ nullable: true })
    year: string;

    @Expose()
    @Column({ nullable: true })
    rated: string;

    @Expose()
    @Column({ nullable: true })
    released: string;

    @Expose()
    @Column({ nullable: true })
    genre: string;

    @Expose()
    @Column({ nullable: true })
    director: string;

    @Expose()
    @Column({ nullable: true })
    writer: string;

    @Expose()
    @Column({ nullable: true })
    actors: string;

    @Expose()
    @Column({ type: 'text', nullable: true })
    plot: string;

    @Expose()
    @Column({ nullable: true })
    language: string;

    @Expose()
    @Column({ nullable: true })
    country: string;

    @Expose()
    @Column({ nullable: true })
    awards: string;

    @Expose()
    @Column({ nullable: true })
    poster: string;

    @Expose()
    @Column({ type: 'integer', nullable: true })
    metascore: number;

    @Expose()
    @Column({ type: 'double precision', nullable: true })
    imdbRating: number;

    @Expose()
    @Column({ type: 'integer', nullable: true })
    imdbVotes: number;

    @Expose()
    @Column({ nullable: true })
    type: string;

    @Expose()
    @Column({ nullable: true })
    dvd: string;

    @Expose()
    @Column({ nullable: true })
    boxOffice: string;

    @Expose()
    @Column({ nullable: true })
    production: string;

    @Expose()
    @Column({ nullable: true })
    website: string;

    serialize(): MovieDTO {
        return new MovieDTO(classToPlain(this));
    }

    static deserialize(dto: MovieDTO): Movie {
        return plainToClass(Movie, dto);
    }
}