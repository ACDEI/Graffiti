import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Photo } from '@core/models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  photoCollection: AngularFirestoreCollection<Photo>;
  private path = 'publications';

  constructor(private fs: AngularFirestore) { 
    this.photoCollection = this.fs.collection(this.path);
  }

  // Insert Publication in DB
  createPublication(publication : Photo) : any{
    //return this.fs.collection(this.path).doc(photo.photo_id).set(photo); //Guarda el PID correcto
    this.photoCollection.add({...publication});
  }

  // Return Photo's List DB
  get_AllPublications() : AngularFirestoreCollection<Photo> {
    return this.photoCollection;
  }

  //Return one publication from DB
  getPhoto(photo_id : string) {

  }

  //Update Publication From DB
  updatePublication(publication: Photo) : Promise<void>{
    return this.fs.doc(this.path + '/' + publication.photo_id)
      .update(publication);
  }

  //Delete a Publication from DB
  delete_Photo(pid: string) : Promise<void>{
    return this.photoCollection.doc(pid).delete();
  }

}
