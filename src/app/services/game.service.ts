import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { PublicationI } from '@core/models/publication';
import { UserI } from '@core/models/user.model';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';

const thresholds = [0,1,3,5,10,20,30,40,50,70,100,150,200,250,300,400,500,650,800,1000];

interface VisitadoI {
  pid: string,
  title: string,
  urlPhoto: string
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  usuario: UserI;

  visitadosDictionary:Map<string, PublicationI>;

  //[level, currentProgress, nextLevelProgress]
  private levelSource:BehaviorSubject<[number, number, number]> = new BehaviorSubject(undefined);
  level:Observable<[number, number, number]> = this.levelSource.asObservable();

  private dataSource:BehaviorSubject<PublicationI> = new BehaviorSubject(undefined);
  data:Observable<PublicationI> = this.dataSource.asObservable();

  constructor(private firestore: AngularFirestore) {
    this.usuario = JSON.parse(window.sessionStorage.getItem("usuario"));
    this.visitadosDictionary = new Map<string, PublicationI>();

    console.log("Visitados");

    firestore.collection("users/" + this.usuario.uid + "/visitados").valueChanges().subscribe( (value:VisitadoI[]) => {
      value.forEach( x => {
        let res:PublicationI = {
          pid:x.pid,
          uid:"",
          title:x.title,
          graffiter:"",
          photoURL:x.urlPhoto,
          coordinates:undefined,
          date:undefined,
          state:undefined,
          themes: undefined,
          nLikes:undefined
        };

        this.visitadosDictionary.set(res.pid,res);
      })
    })  

    this.updateLevel(this.usuario.nVisitados);
  }

  addVisitados(publication: PublicationI){
    var data = {
      pid:publication.pid,
      photoURL:publication.photoURL,
      title:publication.title
    }

    this.firestore.doc("users/" + this.usuario.uid + "/visitados/" + publication.pid).set(data);
    this.firestore.doc("users/" + this.usuario.uid).update({nVisitados: firebase.firestore.FieldValue.increment(1)});

    this.usuario.nVisitados++;

    this.updateLevel(this.usuario.nVisitados);

    this.dataSource.next(publication);
  }

  getLevel(nVisitados: number){
    var cont = 0;

    while(cont < thresholds.length && nVisitados >= thresholds[cont]){
      cont++;
    }

    return nVisitados >= 100 ? 10 : cont;
  }

  updateLevel(nVisitados: number){
    var level:number = this.getLevel(nVisitados);

    this.levelSource.next([level, nVisitados, thresholds[level]]);
  }
}
