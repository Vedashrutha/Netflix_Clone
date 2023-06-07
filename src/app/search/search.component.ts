import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Movie } from '../models/movies';
import { Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchControl = new FormControl();
  searchString:string=''
  searchArray: Movie[]=[]

  constructor(private movieService:MovieService){

  }
  
  suggest(event:any){
    
    this.searchString=event.target.value
    // const params = { query: this.searchString };

    this.movieService.searchMovies(this.searchString).subscribe((response)=>{
      this.searchArray=response
    },
    (error)=>{
      console.error(error);
      
    })
  }
  closeSearch(){
    setTimeout(()=>{
      this.searchArray=[]
    },200)
  }
  displayFn(movie: Movie): string {
    return movie && movie.title ? movie.title : '';
  }

}
