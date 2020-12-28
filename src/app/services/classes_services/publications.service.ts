import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Publication } from '@core/models/publication';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  publicationCollection: AngularFirestoreCollection<Publication>;

  private path = 'publications';

  constructor(private fs: AngularFirestore, private http: HttpClient) { 
    this.publicationCollection = fs.collection(this.path);
  }

  getAllPublications() : AngularFirestoreCollection<Publication> {
    return this.publicationCollection;
  }

  getPublication(pid : string): Observable<Publication> {
    return this.fs.doc<Publication>(`publications/${pid}`).valueChanges();
  }

  createPublication(publication : Publication) : any{
    return this.fs.collection(this.path).doc(publication.pid).set(publication);
  }

  updatePublication(publication: Publication) : Promise<void>{
    return this.fs.doc(this.path + '/' + publication.pid).update(publication);
  }

  deletePublicacion(pid: string) : Promise<void>{
    return this.publicationCollection.doc(pid).delete();
  }

  getUserPublications(uid: string): Observable<any> {
    return this.fs.collection(this.path, ref => ref.where('uid', '==', uid.toString()))
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

  //CLOUD FUNCTIONS
  //private pubsUrl = 'https://us-central1-graffiti-9b570.cloudfunctions.net/APIRest/publications/';  // URL to web api

  /*
  getPublications(): Observable<any[]>{
    return this.http.get<any[]>(this.pubsUrl);
  }

  getPublicationsCount(): Observable<any>{
    return this.http.get<any>(this.pubsUrl + "/count");
  }

  getPublicationsByUserEmail(email: string): Observable<any[]>{
    return this.http.get<any[]>("https://us-central1-graffiti-9b570.cloudfunctions.net/APIRest/users" + this.pubsUrl + "/" + email);
  }

  getPublicationsFromTo(from: Number, to: Number): Observable<any[]>{
    return this.http.get<any[]>(this.pubsUrl + "/from/" + from + "/" + to);
  }

  getPublicationsByGraffiterName(name : String): Observable<any[]>{
    return this.http.get<any[]>(this.pubsUrl + "/autor/" + name);
  }

  getPublicationsByTheme(theme : String): Observable<any[]>{
    return this.http.get<any[]>(this.pubsUrl + "/tematicas/"+ theme);
  }

  deleteById(pid : string){
    return this.http.delete(this.pubsUrl + "/" + pid);
  }

  updateById(pid : string, pub : any ){
    return this.http.put<any>(this.pubsUrl + "/" + pid, pub);
  }

  postPublication(pub : any){
    return this.http.post<any>(this.pubsUrl, pub);
  }
  */
  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////

  //CLOUD FUNCTIONS PUBLICATIONS
  private pubsUrl = 'https://us-central1-graffiti-9b570.cloudfunctions.net/APIRest/publications/';  // URL to web api

  //GET
  getAllPublicationsCF() : Observable<any[]>{
    return this.http.get<any[]>(this.pubsUrl);
  }

  getPublicationByPidCF(pid : any) : Observable<any[]> {
    return this.http.get<any[]>(this.pubsUrl + pid);
  }

  getPublicationsByTitleCF(title: any) : Observable<any[]> {
    return this.http.get<any[]>(this.pubsUrl + "title/" + title);
  }

  getPublicationsByRangeCF(from: any, to: any) : Observable<any[]> {
    return this.http.get<any[]>(this.pubsUrl + "range/" + from + '/' + to);
  }

  getPublicationsCountCF() : Observable<Number> {
    return this.http.get<Number>(this.pubsUrl + "count");
  }

  getPublicationsByUserUidCF(uid : any) : Observable<any[]> {
    return this.http.get<any[]>(this.pubsUrl + "user/" + uid);
  }

  getPublicationsByGraffiterCF(graffiter : any) : Observable<any[]> {
    return this.http.get<any[]>(this.pubsUrl + "graffiter/" + graffiter);
  }

  getPublicationsByThemeCF(theme : any) : Observable<any[]> {
    return this.http.get<any[]>(this.pubsUrl + "themes/" + theme);
  }

  //PUT
  /*
    Update a Publication:
      * pid : Publication PID
      * pub : Publication Data
  */
  putPublicationCF(pid : any, pub : any) {
    return this.http.put(this.pubsUrl + pid, pub);
  }

  //POST
  /*
    Post a Publication
      * pub : Publication Data
  */
  postPublicationCF(pub : any) {
    return this.http.post(this.pubsUrl, pub);
  }

  //DELETE
  /*
    Delete a Publication
      * pid : Publication PID
  */
  deletePublicationCF(pid : any) {
    return this.http.delete(this.pubsUrl + pid);
  }

  //SUBCOLECCION LIKES
  //GET
  getPublicationLikesCF(pid : any): Observable<any[]> {
    return this.http.get<any[]>(this.pubsUrl + "likes/" + pid);
  }

  getPublicationLikesCountCF(pid : any): Observable<Number> {
    return this.http.get<Number>(this.pubsUrl + "likescount/" + pid);
  }

  //PUT
  /*
    Update a Like To a Publication
      * uid : User UID
      * pid : Publication PID
      * pub : Publication Data
  */
  putPublicationLikeFromUserCF(uid : any, pid : any, pub : any) {
    return this.http.put(this.pubsUrl + "likes/" + uid + "&" + pid, pub);
  }

  //POST
  /*
    Post a Like To a Publciation
      * pid : Publication PID
      * user : User Data
  */
  postPublicationLikeCF(pid : any, user: any) {
    return this.http.post(this.pubsUrl + "likes/" + pid, user);
  }

  //DELETE
  /*
    Delete a Like From a Publication
      * uid : User UID
      * pid : Publication PID
  */
  deletePublicationLikeCF(uid : any, pid : any){
    return this.http.delete(this.pubsUrl + "likes/" + uid + "&" + pid);
  }
}
