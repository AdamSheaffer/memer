import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http/src/interfaces';

@Injectable()
export class GiphyService {

  private imageCount = 4;
  private tagCount = 4;
  private baseURL = 'https://api.giphy.com/v1/gifs/search';
  private giphy = environment.giphy;

  constructor(private http: Http) { }

  getRandomTags(): string[] {
    const tags = [];
    for (let i = 0; i < this.tagCount; i++) {
      const rand = this.randomWithMax(GiphyService.tags.length);
      tags.push(GiphyService.tags[rand]);
    }
    return tags;
  }

  getRandomImages(tagName: string): Promise<any> {
    const imageRequests = [];
    for (let i = 0; i < this.imageCount; i++) {
      const args = this.buildParams(tagName, this.randomWithMax(100));
      const req = this.http.get(this.baseURL, args).toPromise().then(res => res.json());
      imageRequests.push(req)
    }
    return Promise.all(imageRequests).then(responses => {
      return responses.map(r => r.data[0].images.fixed_height.url);
    });
  }

  private buildParams(tagName: string, offset: number): RequestOptionsArgs {
    const params = {
      api_key: this.giphy,
      q: this.encodeTag(tagName),
      rating: 'pg-13',
      limit: '1',
      offset
    }
    return { params };
  }

  private encodeTag(tagName: string): string {
    return tagName.replace(' ', '+');
  }

  private randomWithMax(max: number) {
    return Math.round(Math.random() * max);
  }

  private static tags: string[] = [
    'CRYING',
    'DANCING',
    'EATING',
    'FALLING',
    'FINGER GUNS',
    'LAUGHING',
    'MIDDLE FINGER',
    'SLEEPING',
    'CAT',
    'DOG',
    'GOAT',
    'MONKEY',
    'PANDA',
    'SLOTH',
    'POKEMON',
    'ADVENTURE TIME',
    'ARCHER',
    'FUTURAMA',
    'ARRESTED DEVELOPMENT',
    'RICK AND MORTY',
    'SIMPSONS',
    'SPONGEBOB',
    'GAME OF THRONES',
    'LORD OF THE RINGS',
    'BILL MURRAY',
    'SAMUEL L JACKSON',
    'JOHN TRAVOLTA',
    'CHUCK NORRIS',
    'KANYE',
    'RON SWANSON',
    '80S',
    '90S',
    'AWKWARD',
    'EXCITED',
    'MIND BLOWN',
    'HUNGRY',
    'BORED',
    'CONFUSED',
    'TIRED',
    'DRUNK',
    'UNIMPRESSED',
    'RELAXED',
    'ANGRY',
    'SASSY',
    'GUCCI',
    'RUNWAY',
    'ALCOHOL',
    'BACON',
    'HOT DOG',
    'PIZZA',
    'GTA',
    'PWNED',
    'FAIL',
    'ILLUMINATI',
    'BABY',
    'INTERNET',
    'ZOMBIE',
    'BOOBS',
    'DONALD TRUMP',
    'IDGAF',
    'FEELS',
    'DEAL WITH_IT',
    'STAR WARS',
    'TERMINATOR',
    'HARRY POTTER',
    'BIG LEBOWSKI',
    'AMERICAN PSYCHO',
    'NSA',
    'EYE ROLL',
    'FACEPALM',
    'LOL',
    'HIGH FIVE',
    'WINK',
    'MICHAEL SCOTT',
    'SLOW CLAP',
    'FML',
    'GTFO'
  ]

}
