export class Movie {
    id: number
    title: string
    type:string
    cast: string[] = []
    director_id: number
    year:number
    genre: string[] = []
    language: string[] = []
    description: string
    runtime: string
    rating: number
    thumbnail: string
    image: string
    trailerUrl:string
    // movieUrl:string


    constructor(id: number, title: string, type:string,cast: string[], director_id: number, year:number, genre: string[], language: string[], description: string, runtime: string, rating: number, thumbnail: string, image: string,trailerUrl:string) {
        this.id = id
        this.title = title
        this.type=type
        this.cast = cast
        this.director_id = director_id
        this.year = year
        this.genre = genre
        this.language = language
        this.description = description
        this.runtime = runtime
        this.rating = rating
        this.thumbnail = thumbnail
        this.image = image
        this.trailerUrl = trailerUrl
    }

}