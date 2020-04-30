import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { BlogService, Post } from './blog-service.service';
import { Observable } from 'rxjs';
import { TransferState, makeStateKey } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  blogPost: Observable<Post>;

  constructor(private blogService: BlogService, private state: TransferState,
              @Inject(PLATFORM_ID) private platformId: any) {
  }
  ngOnInit() {
    const URL_SLUG = 'pasta-cook';
    const dataKey = makeStateKey(`posts/${URL_SLUG}`);
    const $dataSource = this.blogService.getPost(URL_SLUG);

    this.blogPost = this.blogService.getCachedObservable($dataSource, dataKey);
  }
}
