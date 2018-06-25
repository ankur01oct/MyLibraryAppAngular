export class Books {
    constructor (
        public id :string,
        public title:string,
        public author:string[],
        public imageUrl: string,
        public fav:boolean
     ){}
}