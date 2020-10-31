import { firestore } from 'firebase';

export class Publication {
    pid:string;
    uid:string;
    titulo:string;
    grafitero:string;
    fotoUrl:string;
    location: firestore.GeoPoint;
    fecha:Date;
    estado:string;
    tematicas: string[3];
    nLikes:Number;
}
