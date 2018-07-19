import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog.service';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {

  message;
  messageClass;
  foundBlog = false;
  processing = false;
  blog;
  currentUrl;

  constructor(private _blogService: BlogService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) { }




  ngOnInit() {
    this.currentUrl = this._activatedRoute.snapshot.params;
    this._blogService.getSingleBlog(this.currentUrl.id).subscribe((data) => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.msg;
      }
      else {
        this.blog = {
          title: data.msg.title,
          body: data.msg.body,
          createdBy: data.msg.createdBy,
          createdAt: data.msg.createdAt
        }
        this.foundBlog = true;
      }
    })
  }
  deleteBlog() {
    this.processing = true;
    this._blogService.deleteBlog(this.currentUrl.id).subscribe(data => {

      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this._router.navigate(['/blog']); 
        }, 2000);
      }
    });
  }

}
