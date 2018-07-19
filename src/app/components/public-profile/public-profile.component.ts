import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {

  currentUrl;
  username;
  email;

  constructor(private _authService: AuthService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.currentUrl = this._activatedRoute.snapshot.params;
    this._authService.getPublicProfile(this.currentUrl.username).subscribe((data=>{
      console.log(data.user);
      this.username = data.user.username;
      this.email = data.user.email;
    }))
  }

}
