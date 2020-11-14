import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Publication } from '@core/models/publication';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  publicationCollection: AngularFirestoreCollection<Publication>;

  private path = 'publications';

  constructor(private fs: AngularFirestore) { 
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

  getUserPublications(uid: string) {
    return this.fs.collection('publications', ref => ref.where('uid', '==', uid)).valueChanges();
  }

}
