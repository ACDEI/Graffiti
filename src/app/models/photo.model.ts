import { firestore } from 'firebase';
import { Theme } from './theme.model';

export class BPhoto {
    location: firestore.GeoPoint;
    photo_url:string;
    user_id:string;
}

export class Photo extends BPhoto{
    photo_id: string;
    upl_uid: string;    //Uploader
    title: string;
    author: string;
    photo_url: string;
    location: firestore.GeoPoint;
    date: Date;
    state: string;
    nLikes: Number;
    themes: Theme[];

    //SubNiveles
        //Comments(?)
}
