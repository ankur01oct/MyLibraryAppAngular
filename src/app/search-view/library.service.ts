import { environment } from './../../environments/environment.prod';
import { Books } from './library.model';
import { EventEmitter, Injectable,Inject } from "@angular/core";
import { Router } from "@angular/router";
import {BehaviorSubject} from 'rxjs';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

@Injectable()
export class LibraryService {
    constructor(private http:Http, @Inject(SESSION_STORAGE) private storage: StorageService){}
    private books:Books[];
    
    private port = '3000';
    //private port = (process.env.PORT || '3000');
    
    saveInLocal(key, val): void {
        //console.log('recieved= key:' + key + 'value:' + val);
        this.storage.set(key, val);
       }

       getFromLocal(key): string {
        //console.log('recieved= key:' + key);
        //console.log(this.storage.get(key));
        return this.storage.get(key);
      
       }
       deletefromLocal(key): void{
           this.storage.remove(key);
       }

    
    getBooksList(searhString:string){
       let reqUrl:string= encodeURI(`https://www.googleapis.com/books/v1/volumes?q=${searhString}`);
       console.log("reqUrl ",reqUrl);
       this.books=[]
       return this.http.get(reqUrl)
       .map((res: Response) =>{
            const books:any=res.json().items;
       console.log( " res.json().items",books);            
            for(let book of books){
                if(book.volumeInfo.imageLinks!=undefined){
                this.books.push(new Books(book.id,
                    book.volumeInfo.title,
                    book.volumeInfo.authors,
                    book.volumeInfo.imageLinks.thumbnail,
                    false
                    ));
                }
            else{
                    this.books.push(new Books(book.id,
                        book.volumeInfo.title,
                        book.volumeInfo.authors,
                        "Use Alt",
                        false
                        ));
                }
            }
            return(this.books)
       })
       .catch((error:any) => Observable.throw(error || 'Server error'))
    }

    updateFav(res:any,books:Books[]){
        for (let i  in  books){
            let r:any =(res.find(item => item.id==books[i].id))
            if(r){
                books[i].fav = true;
            }
        }
        //console.log()
        return books;
    }
    createFavBooks(body:any){
        
       return this.http.post(`http://localhost:${this.port}/book`,body)
                .map((res :Response) =>{
                    console.log("create res :", res.json())
                    return(res.json());
                })
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    deleteFavBook(email:string, id:string){
        let reqUrl=`http://localhost:${this.port}/books/${id}/${email}`
        return this.http.delete(reqUrl)
        .map((res:Response) =>{
             console.log(res.json());
             return res.json();
            })
        .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    getFavBooks(email:string){
        return this.http.get(`http://localhost:${this.port}/books/${email}`)
        .map((res:Response) => {
            console.log(res.json());
            return res.json();
        })
        .catch((error:any) => Observable.throw(error || 'Server error'));
    }
}