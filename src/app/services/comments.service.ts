import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  commentCollection : AngularFirestoreCollection<any>;

  constructor(private fs: AngularFirestore, private http : HttpClient, 
    private auth: AuthService) { 
    this.commentCollection = fs.collection("comments");
  }

  //Directly to Firestore
  getAllComments(): AngularFirestoreCollection<any>{
    return this.commentCollection;
  }

  getCommentsByPublication(pid : any) : Observable<any> {
      return this.fs.collection('comments', ref => ref.where('pid', '==', pid.toString())
        .orderBy('timestamp', 'desc'))
      .valueChanges()
      .pipe( map(c => c) );
  }

  deleteComment(cid : any) : Promise<void> {
    return this.commentCollection.doc(cid).delete();
  }

  async isCommentFromUser(uid : string, cid : string) : Promise<any> {
    var res : any;
    await this.fs.collection('comments').doc(cid).get()
      .toPromise().then(l => {
        res = (l.exists && l.get('uid'));
      });
      return new Promise<any>( (resolve,reject) => {
        resolve(res);
      });
  }

  //CLOUD FUNCTIONS COMMENTS

  private comURL = "https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/comments/";

  //GET
  async getAllCommentsCF() : Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.comURL, httpOpt);
  }

  async getCommentByCidCF(cid : any) : Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.comURL + cid, httpOpt);
  }

  async getCommentsPerUserCF(uid : any) : Promise<Observable<any[]>>{
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.comURL + "user/" + uid, httpOpt);
  }

  async getCommentsPerPublicationCF(pid : any) : Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.comURL + "publication/" + pid, httpOpt);
  }

  //PUT
  /*
    Update a Comment
      * cid : Comment CID
      * comment : Comment Data
  */
  async putCommentFC(cid : any, comment : any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.put(this.comURL + cid, comment, httpOpt).subscribe();
  }

  //POST
  /*
    Post a comment
      * comment : Comment Data
  */
  async postCommentCF(comment: any){
    let httpOpt = await this.auth.getHeader();
    return this.http.post(this.comURL, comment, httpOpt).subscribe();
  }

  //DELETE
  /*
    Delete a Comment
      * cid : Comment CID
  */
  async deleteCommentByCidCF(cid : any){
    let httpOpt = await this.auth.getHeader();
    return this.http.delete(this.comURL + cid, httpOpt).subscribe();
  }

}
