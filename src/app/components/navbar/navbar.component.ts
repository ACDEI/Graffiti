import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { UserService } from '@core/services/classes_services/user.service';
import { FlickrService } from '@core/services/flickr.service';
import { LocationService } from '@core/services/location.service';
import { MapService } from '@core/services/map.service';
import * as firebase from 'firebase';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  //Usuario Sesion
  usuarioSesion: any;

  //Form Initialize
  stateList : string[] = ['Perfect', 'Legible', 'Illegible', 'Deteriorated'];
  themesList: any[];
  themesSettings : IDropdownSettings = {
    enableCheckAll: false,
    allowSearchFilter: true,
    limitSelection: 3,
    searchPlaceholderText: 'Buscar por Nombre',
    textField: 'name',
    defaultOpen: false
  };

  //Form Variables
  statusSelector: string;
  themesSelector: string[];
  title: string;
  graffiter: string;

  //Flickr
  conectadoFlickr = false; 
  selectedFile: File = null;
  showButton = false; 
  oauth_token:string;
  oauth_verifier:string; 
  idToken : string;
  tokenFirebase:string;
  token_secret:string; 
  urlFoto:string; 

  constructor(private mapService: MapService, private auth: AuthService, private http: HttpClient, 
      private route: Router, private aroute : ActivatedRoute, 
      private themeService: ThemeService, 
      private fs : FlickrService, private ts: ToastrService) {
   }

  ngOnInit(): void {
    this.usuarioSesion = JSON.parse(window.sessionStorage.getItem("usuario"));
    this.obtenerTematicas();
    this.arreglarModal();

    this.cogerFlickrTokens();
  }

  cogerFlickrTokens(){
    //Obtener Tokens de la URL
    if(this.aroute.snapshot.queryParams != null){
      this.fs.flickr_oauth_verifier = this.aroute.snapshot.queryParams.oauth_verifier;

      //¿Guardar Tokens?
      this.fs.flickr_oauth_token = this.aroute.snapshot.queryParams.oauth_token;
      this.fs.flickr_oauth_token_secret = window.sessionStorage.getItem("flickr_oauth_token_secret");
    }

    //console.log(this.usuarioSesion)

    if(this.usuarioSesion.flickrTokens != null || 
      (this.fs.flickr_oauth_token != null && 
      this.fs.flickr_oauth_token_secret != null)) this.conectadoFlickr = true;
    else this.conectadoFlickr = false;
    
  }

  obtenerTematicas(){
    this.themeService.getAllThemes()
    .snapshotChanges()
    .pipe(
      map((changes) =>
        changes.map((c) => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data(),
        }))
      )
    )
    .subscribe((data) => {
      this.themesList = data;
    });
  }
  

  arreglarModal(){  //Habra que modificar, pero bueno
    document.getElementsByClassName('dropdown-list')[0].setAttribute('id', 'dowp');
    document.getElementById('dowp').style.position = 'inherit';
  }

  cerrarSesion(){
    this.auth.signOut();
  }

  async conectarFlickr(){
    this.fs.conectarFlickr(window.location.href);
  }

  /*
  logData() {
    console.log("oauth_verifier",this.oauth_verifier)
    console.log("flickr_oauth_token",this.fs.flickr_oauth_token)
    console.log("flickr_oauth_token_secret",JSON.parse(window.sessionStorage.getItem("flickr_oauth_token_secret")))
  }
  */


  async subirImagen(){

    const formData : FormData = new FormData();  
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('oauth_token', this.fs.flickr_oauth_token);
    formData.append('oauth_verifier', this.fs.flickr_oauth_verifier);
    formData.append('title', this.title);
    formData.append('token_secret', this.fs.flickr_oauth_token_secret);

    //---------------------- Obtener localizacion del mapa ----------------------------
    let location = this.mapService.selectedPosition;

    var number : Number = this.validateFields(location);
    if(number == -1){
      //En caso de que el graffitero sea nulo o cadena vacía, lo ponemos anónimo
      if(this.graffiter == null || this.graffiter.trim() === '') this.graffiter = "Anónimo";
        
        let photo = { 
          "state": this.statusSelector, 
          "themes": this.themesSelector,
          "title": this.title, 
          "graffiter": this.graffiter,
          "uid": this.usuarioSesion.uid, 
          "pid": this.generatePID(),
          "lat": location.lat,
          "lng": location.lng
        }

        await this.fs.subirFlickr(formData, photo).then(l => {
          this.ts.info("Subiendo publicación...", "", {timeOut: 2000});
          this.showButton = false;
        }).catch(err => {
          this.ts.error("Ha habido un error al subir la publicación", "", {timeOut: 2000});
          this.showButton = true;
        });
      } else if(number == 1) this.ts.error("Introduzca un Título", "", {timeOut: 2000});
      else if(number == 2) this.ts.error("Se requiere alguna Temática", "", {timeOut: 2000});
      else if(number == 3) this.ts.error("¿En qué estado se encuentra?", "", {timeOut: 2000});
      else this.ts.error("Escoja una localización", "", {timeOut: 2000});
   }

  onFileSelected(event){
    this.showButton = true; 
    this.selectedFile = <File>event.target.files[0];
  }

  generatePID(){
    var pid : string = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 24; i++) {
        pid += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return pid;
  }

  validateFields(location) : Number {
    var num: number = -1;
    if(!this.validateTitle()) num = 1; //No hay título
    if(!this.validateThemes()) num = 2; //No hay temáticas
    if(!this.validateState()) num = 3; //No hay estado de conservación
    if(!this.validateLocation(location)) num = 4; //No hay estado de conservación
    return num;
  }

  validateTitle(): boolean{
    return this.title != null && this.title.trim() !== '';
  }

  validateThemes(): boolean {
    return this.themesSelector != null && this.themesSelector != [];
  }

  validateState(): boolean {
    return this.statusSelector != null && this.statusSelector.trim() !== '';
  }

  validateLocation(location){
    return location != null && location.lat != null && location.lng != null;
  }

}
