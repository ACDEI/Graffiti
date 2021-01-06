import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { UserService } from '@core/services/classes_services/user.service';
import { FlickrService } from '@core/services/flickr.service';
import * as firebase from 'firebase';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
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
  urlFoto: string; 
  latSelected : any;
  lngSelected : any;

  //Flickr
  conectadoFlickr = false; 
  selectedFile: File = null;
  showButton = false; 
  oauth_token:string;
  oauth_verifier:string; 
  idToken : string;
  tokenFirebase:string;

  constructor(private auth: AuthService, private http: HttpClient, 
      private route: Router , private ps: PublicationsService, 
      private userService: UserService, private themeService: ThemeService, 
      private fs : FlickrService) {
   }

  ngOnInit(): void {
    this.usuarioSesion = JSON.parse(window.sessionStorage.getItem("usuario"));
    this.obtenerTematicas();
    this.arreglarModal();

    this.conectadoFlickr = JSON.parse(window.sessionStorage.getItem("oauth_verifier"));
    //console.log(this.conectadoFlickr);
    this.oauth_verifier = JSON.parse(window.sessionStorage.getItem("oauth_verifier"));
    //console.log(this.oauth_verifier);
    this.oauth_token = JSON.parse(window.sessionStorage.getItem("oauth_token"));
    //console.log(this.oauth_token);
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
    /* QUITAR CUANDO SEPAMOS QUE FUNCIONA
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
  
    let result = this.http.get<any>(url,{headers});
  
    result.subscribe(data =>{
      console.log(data.url);
      ///Si el usuario acepta flickr devolverá un callback a la home del usuario en malagart
      //this.route.navigateByUrl(data.url);
      window.location.href = data.url; 
    })
    */
  }


  async subirImagen(){

    const formData : FormData = new FormData();  
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('oauth_token', this.oauth_token);
    formData.append('oauth_verifier', this.oauth_verifier);
    formData.append('title', this.title);
    
    let photo = { 
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

    this.fs.subirFlickr(formData, photo);
    /*  QUITAR CUANDO SEPAMOS QUE FUNCIONA

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
   */
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

}
