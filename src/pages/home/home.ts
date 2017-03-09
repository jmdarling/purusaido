import { Component, Injectable } from '@angular/core'
import { Http } from '@angular/http'
import 'rxjs/add/operator/toPromise'

@Injectable()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  audio: HTMLAudioElement
  currentState: string
  currentTrack: string

  constructor (private http: Http) {
    this.audio = new Audio('http://stream.radio.co/s98f81d47e/listen')
    this.currentState = 'stop'
    this.http = http

    setInterval(() => {
      if (this.currentState !== 'play') {
        return
      }

      this.getCurrentTrack()
        .then(track => {
          this.currentTrack = track
        })
    }, 5000)
  }

  pause (): void {
    this.audio.pause()
    this.currentState = 'pause'
    this.currentTrack = ''
  }

  play (): void {
    this.audio.play()
    this.currentState = 'play'

    this.getCurrentTrack()
      .then(track => {
        this.currentTrack = track
      })
  }

  private getCurrentTrack (): Promise<string> {
    return this.http.get('https://public.radio.co/stations/s98f81d47e/status')
      .toPromise()
      .then(response => response.json().current_track.title)
  }
}
