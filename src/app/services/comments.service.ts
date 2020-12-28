import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  commentCollection : AngularFirestoreCollection<any>;

  constructor(private fs: AngularFirestore) { 
    this.commentCollection = fs.collection("comments");
  }

  //Directly to Firestore
  getAllComments(): AngularFirestoreCollection<any>{
    return this.commentCollection;
  }

  getCommentsByPublication(pid : any) : Observable<any> {
    //console.log(pid);
      return this.fs.collection('comments', ref => ref.where('pid', '==', pid.toString()))
      .valueChanges()
      .pipe( map(c => c) );
  }

  deleteComment(cid : any) : Promise<void> {
    return this.commentCollection.doc(cid).delete();
  }

  //Cloud Functions
  getCommentsByPublicationCF(){

  }
}
