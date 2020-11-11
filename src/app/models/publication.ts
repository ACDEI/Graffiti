import { firestore } from 'firebase';

export class Publication {
    pid:string;
    uid:string;
    title:string;
    graffiter:string;
    photoURL:string;
    coordinates: firestore.GeoPoint;
    date:Date;
    state:string;
    themes: string[];
    nLikes:Number;

    constructor(pid:string,uid: string, title: string,graffiter: string,photoURL: string
        ,coordinates: firestore.GeoPoint,date:Date,state:string,themes:string[],nLikes:Number){
        this.uid = uid;
        this.state = state;
        this.date = date;
        this.photoURL = photoURL;
        this.graffiter= graffiter;
        this.coordinates = coordinates;
        this.themes = themes;
        this.nLikes = nLikes;
    }
}
