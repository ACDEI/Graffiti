import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Publication } from '@core/models/publication';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  publicationCollection: AngularFirestoreCollection<Publication>;

  private path = 'publications';
  private pubsUrl = 'https://us-central1-graffiti-9b570.cloudfunctions.net/APIRest/publications';

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

  getUserPublications(uid: string): Observable<AngularFirestoreDocument<Publication>[]> {
    return this.fs.collection<AngularFirestoreDocument<Publication>>('publications', ref => ref.where('uid', '==', uid)).valueChanges();
  }

  getPublicationsByGraffiterName(name : String): Observable<any[]>{
    return this.http.get<any[]>(this.pubsUrl + "/autor/" + name);
  }

  getPublicationsByTheme(theme : String): Observable<any[]>{
    return this.http.get<any[]>(this.pubsUrl + "/tematicas/"+ theme);
  }

}
