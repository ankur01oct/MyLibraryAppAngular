import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { SearchViewComponent } from './search-view/search-view.component';
import { LibraryService } from './search-view/library.service';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { StorageServiceModule } from 'angular-webstorage-service';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SearchViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpModule,
    StorageServiceModule 
  ],
  providers: [LibraryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
