import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToMany } from "typeorm";
import { Expose, Exclude, classToPlain } from "class-transformer";
import { Movie } from "./movie.entity";
import { CommentDTO } from "src/dtos/comment.dto";

@Entity()
export class Comment {

    @Expose()
    @PrimaryGeneratedColumn()
    id: number;

    @Expose()
    @Column({ length: 64 })
    user: string;

    @Expose()
    @Column({ type: 'text' })
    text: string;

    @Expose()
    @Column({ type: 'integer' })
    rating: number;

    @Exclude()
    @ManyToMany(_ => Movie, movie => movie.comments, { lazy: true })
    movie: Promise<Movie>;

    async serialize(): Promise<CommentDTO> {
        const movie = await this.movie;
        const dto = new CommentDTO({ ...classToPlain(this), imdbID: movie.imdbID });

        return dto;
    }
}