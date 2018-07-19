import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { BlogService } from '../../../services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  message;
  messageClass;
  blog={
    title: String,
    body: String
  }
  processing= false;
  currentUrl;
  loading=true;

  constructor(private location : Location,
              private _activatedRoute : ActivatedRoute,
              private _blogService: BlogService,
              private _router : Router) { }

  ngOnInit() {
   this.currentUrl = this._activatedRoute.snapshot.params;
  this._blogService.getSingleBlog(this.currentUrl.id).subscribe((data)=>{
    console.log(data);
    if(data.success){
      this.blog = data.msg;
      this.loading =false;
    }
    else{
     
      this.messageClass ='alert alert-danger',
      this.message= "Blog not found";
    }
  })
  }

  updateBlogSubmit(){
    this.processing =true;
    this._blogService.getEditBlog(this.blog).subscribe(data=>{
      console.log("blog data",data )
      if(!data.success){
          this.messageClass = 'alert alert-danger';
          this.message = data.msg;
          this.processing = false;
      }
      else{
        this.messageClass = 'alert alert-success';
        this.message = data.msg;
        setTimeout(()=>{
          this._router.navigate(['/blog'])
        },2000)
      }
    })
  }

  goBack(){
    this.location.back();
  }
}
