import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class OmdbClientService {
    constructor(
        private readonly http: HttpService,
    ) { }

    getByMovieTitle(title: string): Observable<any> {
        return this.http.get('/', { params: { t: title } });
    }

    getByImdbID(imdbID: string): Observable<any> {
        return this.http.get('/', { params: { i: imdbID } });
    }
}

