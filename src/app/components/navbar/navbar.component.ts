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
  latSelected:string;
  lngSelected:string;


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
      private userService: UserService, private themeService: ThemeService, 
      private fs : FlickrService, private ts: ToastrService , private ps: PublicationsService) {
   }

  ngOnInit(): void {
    this.usuarioSesion = JSON.parse(window.sessionStorage.getItem("usuario"));
    this.obtenerTematicas();
    this.arreglarModal();

    this.cogerFlickrTokens();
    //this.conectadoFlickr = JSON.parse(window.sessionStorage.getItem("oauth_verifier"));
    //console.log(this.conectadoFlickr);
    //this.oauth_verifier = JSON.parse(window.sessionStorage.getItem("flickr_oauth_verifier"));
    //console.log(this.oauth_verifier);
    //this.oauth_token = JSON.parse(window.sessionStorage.getItem("flickr_oauth_token"));
    //console.log(this.oauth_token);
  }

  cogerFlickrTokens(){
    console.log("Hola buenas");
    
    //Obtener Tokens de la URL
    if(this.aroute.snapshot.queryParams != null){
      this.oauth_token = this.aroute.snapshot.queryParams.oauth_token;
      this.oauth_verifier = this.aroute.snapshot.queryParams.oauth_verifier;
      window.sessionStorage.setItem("flickr_oauth_token", JSON.stringify(this.oauth_token));
      window.sessionStorage.setItem("flickr_oauth_verifier", JSON.stringify(this.oauth_verifier));
      console.log("vefifier -------> " + this.oauth_verifier);

      //¿Guardar Tokens?
      this.fs.flickr_oauth_token = this.oauth_token;
      this.fs.flickr_oauth_token_secret = this.oauth_verifier;

      console.log(this.oauth_token);
    }

    if(this.fs.flickr_oauth_token != null && this.fs.flickr_oauth_token_secret != null){
      this.conectadoFlickr = true;

      this.oauth_verifier = JSON.parse(window.sessionStorage.getItem("flickr_oauth_verifier"));
      console.log("verifier------------> " + this.oauth_verifier);
      this.oauth_token = JSON.parse(window.sessionStorage.getItem("flickr_oauth_token"));
      //console.log(this.oauth_token);
    }
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
    //this.uid = "";
    this.auth.signOut();
  }

  async conectarFlickr(){
    this.fs.conectarFlickr(window.location.href);
    console.log(this.fs.tokenFirebase)


    let self = this; 
    await firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
      // Send token to your backend via HTTPS
      // ...
      self.tokenFirebase = idToken; 
      //console.log(idToken);
    }).catch(function(error) {
      // Handle error
    });


     console.log(this.tokenFirebase);

     const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenFirebase });

    let url = "http://localhost:5001/graffiti-9b570/us-central1/MalagArtApiWeb/flickr/conectar";
  
    
    //let result = 
    
    this.http.get<any>(url,{headers}).toPromise().then( data => {
      console.log(data.url);
      self.token_secret = data.token_secret; 
      ///Si el usuario acepta flickr devolverá un callback a la home del usuario en malagart
      //this.route.navigateByUrl(data.url);
      window.location.href = data.url; 
      self.cogerFlickrTokens();
    }).catch( error => {
      console.log(error)
    });

    /*
    result.subscribe(data =>{
      console.log(data.url);
      self.token_secret = data.token_secret; 
      ///Si el usuario acepta flickr devolverá un callback a la home del usuario en malagart
      //this.route.navigateByUrl(data.url);
      window.location.href = data.url; 
      self.cogerFlickrTokens();
    })
    */
    
  }


  async subirImagen(){

    const formData : FormData = new FormData();  
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('oauth_token', this.oauth_token);
    formData.append('oauth_verifier', this.oauth_verifier);
    formData.append('title', this.title);
    formData.append('token_secret', this.token_secret);

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

        this.fs.subirFlickr(formData, photo);
        this.ts.success("Publicación Subida Correctamente", "", {timeOut: 2000});
      } else if(number == 1) this.ts.error("Introduzca un Título", "", {timeOut: 2000});
      else if(number == 2) this.ts.error("Se requiere alguna Temática", "", {timeOut: 2000});
      else if(number == 3) this.ts.error("¿En qué estado se encuentra?", "", {timeOut: 2000});
      else this.ts.error("Escoja una localización", "", {timeOut: 2000});
     
      this.showButton = false; 
  

     let photo : any;
     let url = "http://localhost:5001/graffiti-9b570/us-central1/MalagArtApiWeb/flickr/upload";
     let result = await this.http.post<any>(url,formData);
     let self = this; 
     
     await result.subscribe(data =>{
        //self.idFoto = data.id ;
        console.log(data);
        self.urlFoto = "https://live.staticflickr.com/"+ data.photo.server + "/"+ data.photo.id +"_"+ data.photo.secret +".jpg" ;
        console.log(self.urlFoto);

        let d = new Date();
         // TODO lat y long
        photo = { 
          "state": this.statusSelector, 
          "themes": this.themesSelector,
          "title": this.title, 
          "graffiter": this.graffiter , 
          "photoURL": this.urlFoto , 
          "uid": this.usuarioSesion.uid, 
          "pid": this.generatePID(),
          "lat": this.latSelected,
          "lng": this.lngSelected
        }
        
        this.ps.postPublicationCF(photo).subscribe();
      })
      
     this.showButton = false; 
   
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
