import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, Validators ,FormBuilder, FormControl } from '@angular/forms';
import { AuthGuard } from '../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;


  constructor(private formBuilder: FormBuilder,
              private _authService: AuthService,
              private _router: Router,
              private _authGuard : AuthGuard) { 

                this.createForm(); // Create Login Form when component is constructed
              }

  ngOnInit() {
    if(this._authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = "You must be logged in to view that page!!";
      this.previousUrl = this._authGuard.redirectUrl;
      this._authGuard.redirectUrl = undefined;
    }
  }

 createForm() {
  this.form = this.formBuilder.group({
    username: ['', Validators.required], // Username field
    password: ['', Validators.required] // Password field
  });
}

  // Function to disable form
  disableForm() {
    this.form.controls['username'].disable(); // Disable username field
    this.form.controls['password'].disable(); // Disable password field
  }

  // Function to enable form
  enableForm() {
    this.form.controls['username'].enable(); // Enable username field
    this.form.controls['password'].enable(); // Enable password field
  }

   // Functiont to submit form and login user
   onLoginSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm(); // Disable form while being process
    // Create user object from user's input
    const user = {
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    }

      // Function to send login data to API
      this._authService.login(user).subscribe(data => {
        // Check if response was a success or error
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Set bootstrap error class
          this.message = data.message; // Set error message
          this.processing = false; // Enable submit button
          this.enableForm(); // Enable form for editting
        } else {
          this.messageClass = 'alert alert-success'; // Set bootstrap success class
          this.message = data.message; // Set success message
          // Function to store user's token in client local storage
          this._authService.storeUserData(data.token, data.user);
          // After 2 seconds, redirect to dashboard page
          setTimeout(() => {

            if(this.previousUrl){
              this._router.navigate([this.previousUrl])
            }
            else{
              this._router.navigate(['/dashboard']); // Navigate to dashboard view
            }
          }, 2000);
        }
      });
    }


}
