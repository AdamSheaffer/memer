import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Http } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http/src/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {

  private imageCount = 4;
  private tagCount = 4;
  private baseURL = 'https://api.giphy.com/v1/gifs/search';
  private giphy = environment.giphy;

  constructor(private http: Http) { }

  getRandomTags(): string[] {
    const rands = this.randomWithMax(GiphyService.tags.length, this.tagCount);
    return rands.map(n => GiphyService.tags[n]);
  }

  getRandomImages(tagName: string): Promise<any> {
    const imageRequests = [];
    const randomNums = this.randomWithMax(100, this.imageCount);
    for (let i = 0; i < randomNums.length; i++) {
      const args = this.buildParams(tagName, randomNums[i]);
      const req = this.http.get(this.baseURL, args).toPromise().then(res => res.json());
      imageRequests.push(req);
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
    };
    return { params };
  }

  private encodeTag(tagName: string): string {
    return tagName.replace(' ', '+');
  }

  private randomWithMax(max: number, count: number, ): number[] {
    const rands = [];
    while (rands.length < count) {
      const rand = Math.round(Math.random() * max);
      if (rands.includes(rand)) { continue; }
      rands.push(rand);
    }
    return rands;
  }

  // tslint:disable-next-line:member-ordering
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
    'RON SWANSON',
    'JUDGE JUDY',
    'SMH',
    'WEED',
    'THUG LIFE',
    'ALIENS',
    'FLIGHT OF THE CONCORDS',
    'PARKS AND REC',
    'BREAKING BAD',
    'THE FAST AND THE FURIOUS',
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
    'ALCOHOL',
    'BACON',
    'HOT DOG',
    'PIZZA',
    'GTA',
    'PWNED',
    'FAIL',
    'RICH',
    'BABY',
    'BOOBS',
    'DONALD TRUMP',
    'IDGAF',
    'FEELS',
    'DEAL WITH IT',
    'STAR WARS',
    'TERMINATOR',
    'HARRY POTTER',
    'BIG LEBOWSKI',
    'AMERICAN PSYCHO',
    'EYE ROLL',
    'FACEPALM',
    'HIGH FIVE',
    'WINK',
    'MICHAEL SCOTT',
    'SNOOP DOG',
    'MIRIN',
    'CARTOONS',
    'H3H3',
    'MICHAEL CERA',
    'TITUS ANDROMEDON',
    'COMMUNITY',
    'RAP',
    'DAVE CHAPPELLE',
    'MOUSTACHE',
    'BOOTY',
    'TIM AND ERIC',
    'FOOD',
    'GAMING',
    'THE GRIND',
    'NIPPLES',
    'DICKS',
    'MAN BUTTS',
    'SLOW CLAP',
    'FML',
    'GTFO',
    'YAS',
    'YAS QUEEN',
    'BABE',
    'WES ANDERSON',
    'BROAD CITY',
    'WORKAHOLICS'
  ];

}
