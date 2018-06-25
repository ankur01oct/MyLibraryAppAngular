import { Books } from './library.model';
import { LibraryService } from './library.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css']
})
export class SearchViewComponent implements OnInit {

  constructor(private libraryservice:LibraryService) { }

  public books:Books[];
  private updatedFav:boolean= false;
  onSubmit(form:NgForm){
    //check if first search has been done        
    this.books=[]
    let searchval:string=form.value.namesearch.trim();
    if(searchval==undefined||searchval==null||searchval==''){
      alert("Please enter a value to search");
      return;
    }

    this.libraryservice.getBooksList(searchval).subscribe(
      res=>{
        this.books=res;
        let email:string = this.libraryservice.getFromLocal("email");
        if(email){
          this.libraryservice.getFavBooks(email).subscribe(
           res=>{
             console.log("res inside fav ",res);
              //if user already has fav books
             if(res.length!==0){
               this.books = this.libraryservice.updateFav(res,this.books);
               this.updatedFav = true
             }
           },
           err => {
             console.log ("error in get fav :", err);
           }
         )
       }
        console.log("this.books",this.books);
      },
      err=>console.log(err)
    )
  }

  removeFav(book:Books){
    this.libraryservice.deleteFavBook(this.libraryservice.getFromLocal("email"),book.id)
    .subscribe(
      res => {
        if (res.id == book.id){
        console.log("removed from favourite list");
        let index = this.books.findIndex(item => item.id == book.id )
        this.books[index].fav = false;
      }
      },
      err => console.log("error is deletion of fav :",err)
    )
  }
  addFav(book:Books){
    let email:string = this.libraryservice.getFromLocal("email");


  //logged in
  if(email){
    if(!this.updatedFav){
    this.libraryservice.getFavBooks(email).subscribe(
      res=>{
        console.log("res inside fav ",res);
         //if user already has fav books
        if(res.length!==0){
          this.books = this.libraryservice.updateFav(res,this.books)
          //check if current book is already a fav book
          let index = this.books.findIndex(item => item.id == book.id )
          if(this.books[index].fav===true){
            console.log("already a favourite book")
            return 
          }
        }
      },
      err => {
        console.log ("error in get fav :", err);
      }
    )
    }   
     //if user has no fav book
        let body ={
          "email":email,
          "id": book.id
        }
        this.libraryservice.createFavBooks(body).subscribe(
          res=>{
            if (res.id==book.id){
              let index = this.books.findIndex(item => item.id == res.id )
              this.books[index].fav=true;
            }
          },
          error => {
            console.log("error in create :",error);
          }
        )
    
    console.log("currentLocalEmail :",email,"fav book",book);
  }
   else{
      alert("Please login to save favourite");
   }
  }

  ngOnInit() {
  }

}
