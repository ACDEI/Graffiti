import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  commentCollection : AngularFirestoreCollection<any>;

  constructor(private fs: AngularFirestore, private http : HttpClient) { 
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

  //CLOUD FUNCTIONS COMMENTS

  private comURL = "url/comments/";

  getAllCommentsCF() : Observable<any[]> {
    return this.http.get<any[]>(this.comURL);
  }

  getCommentByCidCF(cid : any) : Observable<any[]> {
    return this.http.get<any[]>(this.comURL + cid);
  }

  getCommentsPerUserCF(uid : any) : Observable<any[]>{
    return this.http.get<any[]>(this.comURL + "user/" + uid);
  }

  getCommentsPerPublicationCF(pid : any) : Observable<any[]> {
    return this.http.get<any[]>(this.comURL + "publication/" + pid);
  }

  //PUT
  /*
    Update a Comment
      * cid : Comment CID
      * comment : Comment Data
  */
  putCommentFC(cid : any, comment : any) {
    return this.http.put(this.comURL + cid, comment);
  }

  //POST
  /*
    Post a comment
      * comment : Comment Data
  */
  postComment(comment: any){
    return this.http.post(this.comURL, comment);
  }

  //DELETE
  /*
    Delete a Comment
      * cid : Comment CID
  */
  deleteCommentByCid(cid : any){
    return this.http.delete(this.comURL + cid);
  }

}
