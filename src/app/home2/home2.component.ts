import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.scss'],
})
export class Home2Component {
  latestMovies: Movie[] = [];
  limit:number=3
  constructor(private spinner: NgxSpinnerService,private movieService:MovieService,private router:Router) {}
  async delay(ms: number) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), ms)).then(
    
    );
  }

  ngOnInit() {
    this.show();
    this.movieService.getLatestMovie(this.limit).subscribe((response)=>{
      this.latestMovies=response
    })
    this.latestMovies.forEach((latest)=>{
      console.log(latest.image);
      
    })   
  }
  
  show() {
    this.spinner.show();
    this.delay(1500).then((any) => {
      this.spinner.hide();
    });
  }

  viewDetails(id: number) {
    this.router.navigate(['title/' + id]);
  }

  openPlayer(itemId: number) {
    this.router.navigate(['/play/' + itemId])
  }
}
