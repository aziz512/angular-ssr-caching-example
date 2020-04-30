import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TransferState, StateKey } from '@angular/platform-browser';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { map, take, startWith } from 'rxjs/operators';

const POSTS_DATA = {
  'pasta-cook': {
    title: 'How to pasta cook with oil olive',
    content: `At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.`
  }
};
export interface Post {
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private state: TransferState,
              @Inject(PLATFORM_ID) private platformId: any) { }

  getPost(slug: string): Observable<Post> {
    const $subject = new Subject<Post>();
    setTimeout(() => {
      console.warn('Request is made');
      $subject.next(POSTS_DATA[slug]);

      // send updates
      if (isPlatformBrowser(this.platformId)) {
        let counter = 1;
        setInterval(() => {
          const post: Post = { ...POSTS_DATA[slug] };
          post.title = `Update ${counter}: ${post.title}`;
          $subject.next(post);
          counter++;
        }, 1000);
      }
    }, 1500);
    return $subject;
  }

  getCachedObservable($dataSource: Observable<any>, dataKey: StateKey<any>) {
    if (isPlatformServer(this.platformId)) {
      return $dataSource.pipe(map(datum => {
        this.state.set(dataKey, datum);
        return datum;
      }), take(1));
    } else if (isPlatformBrowser(this.platformId)) {
      const savedValue = this.state.get(dataKey, null);
      const observableToReturn = savedValue ? $dataSource.pipe(startWith(savedValue)) : $dataSource;
      return observableToReturn;
    }
  }
}
