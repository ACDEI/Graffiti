import { firestore } from 'firebase';

export class BPhoto {
    location: firestore.GeoPoint;
    photo_url:string;
    user_id:string;
}

export class Photo extends BPhoto{
    photo_id: string;
}
