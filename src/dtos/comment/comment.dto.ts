export class CommentDTO {
    id: number;
    imdbID: string;
    user: string;
    text: string;
    rating: number;

    constructor(init: Partial<CommentDTO>) {
        Object.assign(this, init);
    }
}