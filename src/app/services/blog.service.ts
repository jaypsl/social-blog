import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  options;

  constructor(private _authService: AuthService,
              private _http : Http) { }

  createAuthenticationHeaders() {
    this._authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this._authService.authToken // Attach token
      })
    });
  }
  
  newBlog(blog){
    this.createAuthenticationHeaders();
    return this._http.post('http://localhost:3000/blogs/newBlog',blog, this.options)
    .pipe(map(data => data.json())) 
  }

  getAlllBlogs(){
    this.createAuthenticationHeaders();
    return this._http.get('http://localhost:3000/blogs/allblogs', this.options)
    .pipe(map(data => data.json())) 
  }

  getSingleBlog(id){
    this.createAuthenticationHeaders();
    return this._http.get('http://localhost:3000/blogs/singleBlog/'+ id , this.options)
    .pipe(map(data=>data.json()))
  }

  getEditBlog(blog){
    this.createAuthenticationHeaders();
    return this._http.put('http://localhost:3000/blogs/updateBlog', blog, this.options)
    .pipe(map(data=>data.json()))
  }

  deleteBlog(id){
    this.createAuthenticationHeaders();
    return this._http.delete('http://localhost:3000/blogs/deleteBlog/' +id , this.options)
    .pipe(map(data=>data.json()))
  }


  likeBlog(id){
    const blogData = {id: id}
    return this._http.put('http://localhost:3000/blogs/likeBlog',blogData, this.options)
    .pipe(map(data=>data.json()))
  }

  dislikeBlog(id){
    const blogData = {id: id}
    return this._http.put('http://localhost:3000/blogs/dislikeBlog',blogData, this.options)
    .pipe(map(data=>data.json()))
  }

  postComment(id , comment){
    this.createAuthenticationHeaders();
    const blogData ={
      id: id,
      comment : comment
    }
    return this._http.post('http://localhost:3000/blogs/comment', blogData, this.options)
    .pipe(map(data=> data.json()))
  }
}
