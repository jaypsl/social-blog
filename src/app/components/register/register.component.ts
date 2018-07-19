import { Component, OnInit } from '@angular/core';
import { FormBuilder , FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form : FormGroup;
  message;
  messageClass;
  processing : Boolean = false;
  emailValid;
  emailMsg;
  usernameValid;
  usernameMsg;

  constructor(private _formBuilder : FormBuilder,
              private _authService : AuthService,
              private _router: Router ) {

      this.createForm()
   }

  ngOnInit() {
  }

  createForm(){
    this.form = this._formBuilder.group({
      email : ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ])],
      username : ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35)
      ])],
      confirm : ['', Validators.required]
    },{validator :this.matchingPasswords('password','confirm')})
}

onRegisterSubmit(){
  this.processing = true;
  this.disableForm();

  const user = {
    email : this.form.get('email').value,
    username :this.form.get('username').value,
    password : this.form.get('password').value
  }

  this._authService.registerUser(user)
  .subscribe((data)=>{
      console.log(data);
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      }
      else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(()=>{
          this._router.navigate(['/login']);
        },2000);
      }
  })
}

checkusername(){
  // const email = this.form.get('email').value;
  this._authService.checkUsername(this.form.get('username').value)
  .subscribe((data)=>{
    if(!data.success){
      this.usernameValid=false;
      this.usernameMsg = data.message
    }
    else{
      this.usernameValid =true;
      this.usernameMsg = data.message;
      this.messageClass = 'alert alert-success';
    }
  });
}

checkEmail(){
  const email = this.form.get('email').value;
  this._authService.checkEmail(email)
  .subscribe((data)=>{
    if(!data.success){
      console.log(data);
      this.emailValid=false;
      this.emailMsg = data.message
    }
    else{
      console.log(data)
      this.emailValid =true;
      this.emailMsg = data.message;
      this.messageClass = 'alert alert-success';
    }
  });
}

disableForm(){
  this.form.controls['email'].disable();
  this.form.controls['username'].disable();
  this.form.controls['password'].disable();
  this.form.controls['confirm'].disable();
}

enableForm(){
  this.form.controls['email'].enable();
  this.form.controls['username'].enable();
  this.form.controls['password'].enable();
  this.form.controls['confirm'].enable();
}


matchingPasswords(password,confirm){
  return (group: FormGroup)=>{
    if(group.controls[password].value=== group.controls[confirm].value){
      return null;
    }
    else{
      return {'matchingpasswords': true}
    }
  }
}
// validateEmail(){

// }
}
