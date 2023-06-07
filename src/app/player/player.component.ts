import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Movie } from '../models/movies';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  hideControls = false;
  timeoutId: any;

  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef;
  @ViewChild('videoContainer') videoContainerRef!: ElementRef;
  @ViewChild(MatMenuTrigger) playbackSpeedMenuTrigger: MatMenuTrigger;


  idObtained: number = 0;
  contentData: Movie = new Movie(0, '', '', [], 0, 0, [], [], '', '', 0, '', '', '');
  progress = 0;
  totalDuration: string = '';
  remainingTime: string = ' 00:00 ';
  playbackSpeeds: number[] = [0.5, 1, 1.5, 2];
  isFullscreen: boolean = false;
  isPlaying: boolean = false;
  isMuted: boolean = false;
  volume: number = 1;
  showControls: boolean = true;
  playbackSpeed: number = 1;
  isDragging: boolean = false;
  video: ElementRef<HTMLVideoElement>;
  elapsedSeconds = 0;
 

  constructor(
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((prms) => {
      this.idObtained = parseInt(prms['id']);
      this.movieService.getMovieById(this.idObtained).subscribe((data) => {
        this.contentData = data;
      });
    });
    
    this.timeoutId = setTimeout(() => this.hideVideoControls(), 5000);
  }

  showVideoControls() {
    this.hideControls = false;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.hideVideoControls(), 5000);
  }

  hideVideoControls() {
    this.hideControls = true;
  }

  togglePlay() {
    const video = this.videoPlayerRef.nativeElement;
    if (this.isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  // MUTE-UNMUTE
  toggleMute() {
    const video = this.videoPlayerRef.nativeElement;
    video.muted = !video.muted;
    this.isMuted = video.muted;
  }

  // VOLUME CONTROLLER
  changeVolume(event: Event) {
    const video = this.videoPlayerRef.nativeElement;
    const value = (event.target as HTMLInputElement).value;
    this.volume = parseFloat(value);
    video.volume = this.volume;
  }

  togglePiPMode() {
    const video = this.videoPlayerRef.nativeElement as HTMLVideoElement;
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else if (video && video.requestPictureInPicture) {
      video.requestPictureInPicture();
    }
  }
  
  /*---------------------------------------------------------------
  // MOUSE EVENTS
   ---------------------------------------------------------------*/
  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.isDragging) {
      // Handle the drag end event
      this.isDragging = false;
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    // Check if the click is on the progress bar
    if (
      event.target instanceof HTMLDivElement &&
      event.target.classList.contains('progress-bar')
    ) {
      // Handle the drag start event
      this.isDragging = true;

      // Calculate the progress based on the mouse position
      const progressBar = event.target as HTMLDivElement;
      const progressBarWidth = progressBar.clientWidth;
      const offsetX = event.offsetX || (event as any).layerX; // Handle different browser event properties
      const progress = offsetX / progressBarWidth;

      // Update the video progress accordingly
      this.updateVideoProgress(progress);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      // Calculate the progress based on the mouse position
      const progressBar = document.querySelector(
        '.progress-bar'
      ) as HTMLDivElement;
      const progressBarWidth = progressBar.clientWidth;
      const offsetX = event.offsetX || (event as any).layerX; // Handle different browser event properties
      const progress = offsetX / progressBarWidth;

      // Update the video progress accordingly
      this.updateVideoProgress(progress);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: WheelEvent) {
    // Check the scroll direction
    const video = this.videoPlayerRef.nativeElement;
    const scrollDelta = Math.sign(event.deltaY); // -1 for scrolling up, 1 for scrolling down

    // Adjust the volume based on the scroll direction
    if (scrollDelta === -1) {
      // Increase the volume by 10 (or any desired value)
      video.nativeElement.volume += 0.1;
    } else if (scrollDelta === 1) {
      // Decrease the volume by 10 (or any desired value)
      video.nativeElement.volume -= 0.1;
    }

    // Ensure the volume stays within the range of 0 to 1
    video.nativeElement.volume = Math.max(
      0,
      Math.min(1, video.nativeElement.volume)
    );
  }

  /*-------------------------------------------------------------
  // KEYBOARD EVENTS
  -------------------------------------------------------------*/

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.code) {
      case 'Space':
      case 'KeyK':
        event.preventDefault();
        this.togglePlay();
        break;

      case 'ArrowRight':
        event.preventDefault();
        this.seekForward(10);
        break;

      case 'ArrowLeft':
        event.preventDefault();
        this.seekBackward(10);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.increaseVolume(0.1);
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.decreaseVolume(0.1);
        break;

      case 'F11':
        event.preventDefault();
        this.toggleFullscreen()
        break;

      default:
        break;
    }
    this.showVideoControls();
  }

  seekForward(seconds: number) {
    const video = this.videoPlayerRef.nativeElement;
    video.currentTime += seconds;
  }

  seekBackward(seconds: number) {
    const video = this.videoPlayerRef.nativeElement;
    video.currentTime -= seconds;
  }

  updateVideoProgress(progress: number): void {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    const duration = videoElement.duration;
    const newTime = progress * duration;
    videoElement.currentTime = newTime;
  }

  updateProgressBar(): void {
    const video = this.videoPlayerRef.nativeElement;
    this.totalDuration = this.formatTime(video.duration);

    this.progress = (video.currentTime / video.duration) * 100;
    video.addEventListener('timeupdate', () => {
      this.calculateRemainingTime();
    });
  }

  increaseVolume(volumeStep: number) {
    const video = this.videoPlayerRef.nativeElement;
    video.volume = Math.min(video.volume + volumeStep, 1);
  }

  decreaseVolume(volumeStep: number) {
    const video = this.videoPlayerRef.nativeElement;
    video.volume = Math.max(video.volume - volumeStep, 0);
  }

  changePlaybackSpeed(event: Event) {
    const video = this.videoPlayerRef.nativeElement;
    const value = (event.target as HTMLInputElement).value;
    this.playbackSpeed = parseFloat(value);
    video.playbackRate = this.playbackSpeed;
  }

  setPlaybackSpeed(speed: number): void {
    const video = this.videoPlayerRef.nativeElement;
    video.playbackRate = speed;
    this.playbackSpeedMenuTrigger.closeMenu();
  }

  calculateRemainingTime(): void {
    const video = this.videoPlayerRef.nativeElement;
    const remainingSeconds = Math.floor(video.duration - video.currentTime);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    this.remainingTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  skipBackward() {
    const video = this.videoPlayerRef.nativeElement;
    video.currentTime -= 10;
  }

  skipForward() {
    const video = this.videoPlayerRef.nativeElement;
    video.currentTime += 10;
  }

  toggleFullscreen() {
    const videoContainer = this.videoContainerRef.nativeElement;
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
      this.isFullscreen = true
    } else {
      this.isFullscreen = false
      document.exitFullscreen();
    }
  }

  seekToPosition(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLDivElement;
    const progressBarWidth = progressBar.offsetWidth;
    const clickX = event.pageX - progressBar.offsetLeft;
    const seekPercentage = (clickX / progressBarWidth) * 100;
    const seekTime =
      (seekPercentage / 100) * this.videoPlayerRef.nativeElement.duration;
    this.videoPlayerRef.nativeElement.currentTime = seekTime;
  }

  // Handle fullscreenchange event to show/hide custom controls
  handleFullscreenChange() {
    const video = this.videoPlayerRef.nativeElement;
    this.showControls =
      !document.fullscreenElement && video === document.activeElement;
  }

  exitPlayer() {
    this.router.navigate(['/title/', this.idObtained])
  }
  
  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  onVideoEnded(): void {
    this.isPlaying = false;
    this.progress = 0;
  }

  ngOnDestroy() {
    // Remove the fullscreenchange event listener when component is destroyed
    document.removeEventListener(
      'fullscreenchange',
      this.handleFullscreenChange.bind(this)
    );
  }
}
