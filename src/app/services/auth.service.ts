import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from "rxjs/operators";
import { tokenNotExpired } from 'angular2-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken;
  user;
  options;

  constructor(private _http : Http) { }

// Function to create headers, add token, to be used in HTTP requests
createAuthenticationHeaders() {
  this.loadToken(); // Get token so it can be attached to headers
  // Headers configuration options
  this.options = new RequestOptions({
    headers: new Headers({
      'Content-Type': 'application/json', // Format set to JSON
      'authorization': this.authToken // Attach token
    })
  });
}

// Function to get token from client local storage
loadToken() {
  this.authToken = localStorage.getItem('token'); // Get token and asssign to variable to be used elsewhere
}

  registerUser(user){
    return this._http.post('http://localhost:3000/authentication/register', user)
    .pipe(map(data => data.json()))  
  }

  checkUsername(username){
    return this._http.get('http://localhost:3000/authentication/checkUsername/'+ username)
    .pipe(map(data => data.json()))  
  }

  checkEmail(email){
    return this._http.get('http://localhost:3000/authentication/checkEmail/' + email)
    .pipe(map(data => data.json()))  
  }
 // Function to login user
 login(user) {
  return this._http.post('http://localhost:3000/authentication/login', user)
  .pipe(map(res => res.json()));
}

// Function to logout
logout() {
  this.authToken = null; // Set token to null
  this.user = null; // Set user to null
  localStorage.clear(); // Clear local storage
}

 // Function to store user's data in client local storage
 storeUserData(token, user) {
  localStorage.setItem('token', token); // Set token in local storage
  localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
  this.authToken = token; // Assign token to be used elsewhere
  this.user = user; // Set user to be used elsewhere
}

// Function to get user's profile data
getProfile() {
  this.createAuthenticationHeaders(); // Create headers before sending to API
  return this._http.get('http://localhost:3000/authentication/profile', this.options)
  .pipe(map(res => res.json()));
}

getPublicProfile(username){
  this.createAuthenticationHeaders();
  return this._http.get('http://localhost:3000/authentication/publicProfile/'+ username , this.options)
  .pipe(map((data)=>data.json()))
}

// Function to check if user is logged in
loggedIn() {
  return tokenNotExpired();
}
}
