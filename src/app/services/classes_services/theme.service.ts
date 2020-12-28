import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Theme } from '../../models/theme.model';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { PublicationsService } from '@core/services/classes_services/publications.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  
  themeCollection: AngularFirestoreCollection<Theme>;

  private themesUrl = 'https://us-central1-graffiti-9b570.cloudfunctions.net/APIRest/themes';  // URL to web api
  private path="themes";

  constructor(private http: HttpClient, private fs: AngularFirestore, private publicationService: PublicationsService) { 
    this.themeCollection = fs.collection(this.path);
  }

  getAllThemes(): AngularFirestoreCollection<Theme>{
    return this.themeCollection;
  }

  getTheme(tid: string): Observable<Theme> {
    return this.fs.doc<Theme>(`publications/${tid}`).valueChanges();
  }

  createTheme(theme: Theme): any{
    return this.fs.collection(this.path).doc(theme.tid).set(theme);
  }

  updateTheme(theme: Theme) : Promise<void>{
    return this.fs.doc(this.path + '/' + theme.tid)
      .update(theme);
  }

  deleteTheme(tid: string) : Promise<void>{
    return this.themeCollection.doc(tid).delete();
  }

  //CLOUD FUNCTIONS THEMES
  //GET
  getAllThemesCF() : Observable<any[]>{
    return this.http.get<any[]>(this.themesUrl);
  }

  getThemeByTidCF(tid : any): Observable<any[]> {
    return this.http.get<any[]>(this.themesUrl + tid);
  }

  //PUT
  /*
    Update a Theme:
      * tid : Theme TID
      * theme : Theme Data
  */
  updateThemeByTidCF(tid : any, theme : any){
    return this.http.put(this.themesUrl + tid, theme);
  }

  //POST
  /*
    Post a Theme:
      * theme : Theme Data
  */
  postThemeCF(theme : any){
    return this.http.post(this.themesUrl, theme);
  }

  //DELETE
  /*
    Delete a Theme:
      * tid : Theme TID
  */
  deleteThemeByTidFC(tid : any){
    return this.http.delete(this.themesUrl + tid);
  }

}
