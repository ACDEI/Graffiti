import { firestore } from 'firebase';

export interface PublicationI {
    pid:string;
    uid:string;
    title:string;
    graffiter:string;
    photoURL:string;
    coordinates: firestore.GeoPoint;
    date:Date;
    state:string;
    themes: string[];
}

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

    constructor(pid:string,uid: string, title: string,graffiter: string,photoURL: string
        ,coordinates: firestore.GeoPoint,date:Date,state:string,themes:string[]){
        this.pid = pid;
        this.uid = uid;
        this.title = title;
        this.state = state;
        this.date = date;
        this.photoURL = photoURL;
        this.graffiter= graffiter;
        this.coordinates = coordinates;
        this.themes = themes;
    }
}

