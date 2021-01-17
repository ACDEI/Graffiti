import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Theme } from '../../models/theme.model';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  
  themeCollection: AngularFirestoreCollection<Theme>;

  private path = "themes";

  constructor(private http: HttpClient, private fs: AngularFirestore, 
    private publicationService: PublicationsService, private auth: AuthService) { 
    this.themeCollection = fs.collection(this.path);
  }

  getAllThemes(): AngularFirestoreCollection<Theme>{
    return this.themeCollection;
  }

  getTheme(tid: string): Observable<Theme> {
    return this.fs.doc<Theme>(`publications/${tid}`).valueChanges();
  }

  createTheme(theme: any): any{
    return this.fs.collection(this.path).doc(theme.name).set(theme);
  }

  /*
  updateTheme(theme: Theme) : Promise<void>{ return this.fs.doc(this.path + '/' + theme.tid).update(theme); }
  deleteTheme(tid: string) : Promise<void>{ return this.themeCollection.doc(tid).delete(); }
  */

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  private themesUrl = "https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/themes";

  //CLOUD FUNCTIONS THEMES
  //GET
  async getAllThemesCF() : Promise<Observable<any[]>>{
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.themesUrl, httpOpt);
  }

  async getThemeByTidCF(tid : any): Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.themesUrl + tid, httpOpt);
  }

  //PUT
  /*
    Update a Theme:
      * tid : Theme TID
      * theme : Theme Data
  */
  async updateThemeByTidCF(tid : any, theme : any){
    let httpOpt = await this.auth.getHeader();
    return this.http.put(this.themesUrl + tid, theme, httpOpt).subscribe();
  }

  //POST
  /*
    Post a Theme:
      * theme : Theme Data
  */
  async postThemeCF(theme : any){
    let httpOpt = await this.auth.getHeader();
    return this.http.post(this.themesUrl, theme, httpOpt).subscribe();
  }

  //DELETE
  /*
    Delete a Theme:
      * tid : Theme TID
  */
  async deleteThemeByTidFC(tid : any){
    let httpOpt = await this.auth.getHeader();
    return this.http.delete(this.themesUrl + tid, httpOpt).subscribe();
  }

}
