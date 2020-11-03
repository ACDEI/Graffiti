import { firestore } from 'firebase';

export class Publication {
    private pid:string;
    private uid:string;
    private titulo:string;
    private grafitero:string;
    private fotoUrl:string;
    private location: firestore.GeoPoint;
    private fecha:Date;
    private estado:string;
    private tematicas: string[];
    private nLikes:Number;

    constructor(pid:string,uid: string, titulo: string,grafitero: string,fotourl: string
        ,location: firestore.GeoPoint,fecha:Date,estado:string,tematicas:string[],nLikes:Number){
        this.uid = uid;
        this.estado =estado;
        this.fecha = fecha;
        this.fotoUrl = fotourl;
        this.grafitero=grafitero;
        this.location = location;
        this.tematicas = tematicas;
        this.nLikes = nLikes;
    }
}
