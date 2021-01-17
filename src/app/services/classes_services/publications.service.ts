import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Publication } from '@core/models/publication';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  publicationCollection: AngularFirestoreCollection<Publication>;

  private path = 'publications';

  constructor(private fs: AngularFirestore, private http: HttpClient,
    private auth: AuthService) { 
  }

  getAllPublications() : Observable<any>{
    return this.fs.collection('publications', ref => ref.orderBy('date', 'desc'))
                  .valueChanges().pipe(map(c => c));
  }

  async getPublication(pid : string): Promise<any> {
    var res : any;
    await this.fs.doc(`publications/${pid}`).get().toPromise().then( p => {
      res = {
        pid : p.get('pid'),
        uid : p.get('uid'),
        photoURL : p.get('photoURL'),
        title : p.get('title'),
        graffiter : p.get('graffiter'),
        coordinates: p.get('coordinates'),
        date : p.get('date'),
        state : p.get('state'),
        themes: p.get('themes')
      }
    });

    return new Promise<any>( (resolve,reject) => {
      resolve(res);
    });
  }

  async getPublicationCount(): Promise<any> {
    var res : any;
    await this.fs.collection(this.path).get().toPromise().then( p => {
      res = p.size;
      //console.log(res);
    });

    return new Promise<any>( (resolve,reject) => {
      resolve(res);
    });
  }

  createPublication(publication : Publication) : any{
    return this.fs.collection(this.path).doc(publication.pid).set(publication);
  }

  /*
    updatePublication(publication: Publication) : Promise<void>{ return this.fs.doc(this.path + '/' + publication.pid).update(publication); }
    deletePublicacion(pid: string) : Promise<void>{ return this.publicationCollection.doc(pid).delete(); }
  */
 
  getUserPublications(uid: string): Observable<any> {
    return this.fs.collection(this.path, ref => ref.where('uid', '==', uid.toString())
    .orderBy('date', 'desc'))
    .valueChanges()
    .pipe( map(c => c) );
  }

  /*
    SUB COLECCION: LIKES
  */

  getLikesByPublication(pid : any) : Observable<any> {
      return this.fs.collection('publications').doc(pid).collection('likes')
      .valueChanges()
      .pipe( map(c => c) );
  }

  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////

  //CLOUD FUNCTIONS PUBLICATIONS
  private pubsUrl = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/publications/';  // URL to web api

  //GET
  async getAllPublicationsCF() : Promise<Observable<any[]>>{
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.pubsUrl, httpOpt);
  }

  async getPublicationByPidCF(pid : any) : Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.pubsUrl + pid, httpOpt);
  }

  async getPublicationsByTitleCF(title: any) : Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.pubsUrl + "title/" + title, httpOpt);
  }

  async getPublicationsByRangeCF(from: any, to: any) : Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.pubsUrl + "range/" + from + '/' + to, httpOpt);
  }

  async getPublicationsCountCF() : Promise<Observable<any>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any>(this.pubsUrl + "count", httpOpt);
  }

  async getPublicationsByUserUidCF(uid : any) : Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.pubsUrl + "user/" + uid, httpOpt);
  }

  async getPublicationsByGraffiterCF(graffiter : any) : Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.pubsUrl + "graffiter/" + graffiter, httpOpt);
  }

  async getPublicationsByThemeCF(theme : any) : Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.pubsUrl + "themes/" + theme, httpOpt);
  }

  //PUT
  /*
    Update a Publication:
      * pid : Publication PID
      * pub : Publication Data
  */
  async putPublicationCF(pid : any, pub : any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.put(this.pubsUrl + pid, pub, httpOpt).subscribe();
  }

  //POST
  /*
    Post a Publication
      * pub : Publication Data
  */
  async postPublicationCF(pub : any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.post(this.pubsUrl, pub, httpOpt).subscribe();
  }

  //DELETE
  /*
    Delete a Publication
      * pid : Publication PID
  */
  async deletePublicationCF(pid : any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.delete(this.pubsUrl + pid, httpOpt).subscribe();
  }

  //SUBCOLECCION LIKES
  //GET
  async getPublicationLikesCF(pid : any): Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.pubsUrl + "likes/" + pid, httpOpt);
  }

  async getPublicationLikesCountCF(pid : any): Promise<Observable<Number>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<Number>(this.pubsUrl + "likescount/" + pid, httpOpt);
  }

  //PUT
  /*
    Update a Like To a Publication
      * uid : User UID
      * pid : Publication PID
      * pub : Publication Data
  */
  async putPublicationLikeFromUserCF(uid : any, pid : any, pub : any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.put(this.pubsUrl + "likes/" + uid + "&" + pid, pub, httpOpt).subscribe();
  }

  //POST
  /*
    Post a Like To a Publciation
      * pid : Publication PID
      * user : User Data
  */
  async postPublicationLikeCF(pid : any, user: any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.post(this.pubsUrl + "likes/" + pid, user, httpOpt).subscribe();
  }

  //DELETE
  /*
    Delete a Like From a Publication
      * uid : User UID
      * pid : Publication PID
  */
  async deletePublicationLikeCF(uid : any, pid : any){
    let httpOpt = await this.auth.getHeader();
    return this.http.delete(this.pubsUrl + "likes/" + uid + "&" + pid, httpOpt).subscribe();
  }
}
