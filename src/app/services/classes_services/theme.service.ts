import { Injectable } from '@angular/core';
import { Theme } from '../../models/theme.model';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Publication } from '@core/models/publication';
import { PublicationsService } from '@core/services/classes_services/publications.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themeCollection: AngularFirestoreCollection<Theme>;

  private path="themes";

  constructor(private fs: AngularFirestore, private publicationService: PublicationsService) { 
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

  /*
  getPublicationsFromTheme(theme: Theme): Publication[] {
    var arrayPID = theme.publications;
    var arrayPublications$: Observable<Publication[]>;
    for(let pid of arrayPID){
      const pub = this.publicationService.getPublication(pid);
      arrayPublications$
    }

    return arrayPublications$;
  }*/
}
