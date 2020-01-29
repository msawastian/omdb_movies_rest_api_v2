import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Expose, Exclude, classToPlain, plainToClass } from "class-transformer";
import { Movie } from "./movie.entity";
import { CommentDTO } from "~dtos/comment/comment.dto";
import { SaveCommentDTO } from "~dtos/comment/save_comment.dto";

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
    @ManyToOne(_ => Movie, movie => movie.comments, { eager: true })
    movie: Promise<Movie>;

    async serialize(): Promise<CommentDTO> {
        const movie = await this.movie;
        const dto = new CommentDTO({ ...classToPlain(this), imdbID: movie.imdbID });

        return dto;
    }

    static deserialize(dto: SaveCommentDTO, movie?: Movie): Comment {
        const comment = plainToClass(Comment, dto);
        if (movie != undefined) {
            comment.movie = Promise.resolve(movie);
        }

        return comment;
    }
}