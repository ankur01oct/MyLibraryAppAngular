import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../search-view/library.service';
declare const gapi: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private sessionstorageservice:LibraryService) { }
  public auth2: any;
  public name:string;
  public imageUrl:string;
  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '243410554507-qitgioqtsfku1fk90s4mp6dj6kthbuth.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        //store it in sessionstorage
        this.name = profile.getName().split(" ")[0];
        this.imageUrl = profile.getImageUrl();
        this.sessionstorageservice.saveInLocal("email", profile.getEmail());
        this.sessionstorageservice.saveInLocal("name",this.name);
        this.sessionstorageservice.saveInLocal("imageUrl",this.imageUrl);
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

ngAfterViewInit(){
      this.googleInit();
}
  ngOnInit() {
    if(this.sessionstorageservice.getFromLocal("email")){
      this.name = this.sessionstorageservice.getFromLocal("name");
      this.imageUrl =this.sessionstorageservice.getFromLocal("imageUrl");
    }
  }

}
