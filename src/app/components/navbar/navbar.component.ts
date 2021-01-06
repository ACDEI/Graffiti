import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { UserService } from '@core/services/classes_services/user.service';
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

  //Form
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

  statusSelector: string;
  themesSelector: string[];
  title: string;
  graffiter: string;
  urlFoto: string; 

  //Flickr
  conectadoFlickr = false ; 
  selectedFile: File = null;
  showButton = false; 
  oauth_token:string;
  oauth_verifier:string; 
  idToken : string;
  tokenFirebase:string;

  constructor(private auth: AuthService, private http: HttpClient, 
      private route: Router , private ps: PublicationsService, 
      private userService: UserService, private themeService: ThemeService, private ts: ToastrService) {
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
      /// si el usuario acepta flickr devolverá un callback a la home del usuario en malagart
      //this.route.navigateByUrl(data.url);
      window.location.href = data.url; 
    })

  }


  async subirImagen(){

     const formData : FormData = new FormData();  
     formData.append('file', this.selectedFile, this.selectedFile.name);
     formData.append('oauth_token',this.oauth_token);
     formData.append('oauth_verifier', this.oauth_verifier);
     formData.append('title',this.title);
 

     let url = "http://localhost:5001/graffiti-9b570/us-central1/MalagArtApiWeb/flickr/upload";
     let result = await this.http.post<any>(url,formData);
     let self = this; 
     
     result.subscribe(data =>{
        //self.idFoto = data.id ;
        console.log(data);
        self.urlFoto = "https://live.staticflickr.com/"+ data.photo.server + "/"+ data.photo.id +"_"+ data.photo.secret +".jpg" ;
        console.log(self.urlFoto);

        let d = new Date();
         // TODO lat y long
        var number: number = this.validateFields();
        if(number == -1){
          //En caso de que el graffitero sea nulo o cadena vacía, lo ponemos anónimo
          if(this.graffiter == null || this.graffiter.trim() === '') this.graffiter = "Anónimo";
          let photo : any = { 
            "state": this.statusSelector, 
            "themes": this.themesSelector,
            "title": this.title, 
            "graffiter": this.graffiter , 
            "photoURL": this.urlFoto , 
            "uid": this.usuarioSesion.uid, 
            "pid": this.generatePID(),
            //"lat": ,
            //"lon": 
          }
          this.ps.postPublicationCF(photo);
          this.ts.success("Publicación Subida Correctamente", "", {timeOut: 2000});
        } else if(number == 1) {
          this.ts.error("Introduzca título porfavor", "", {timeOut: 2000});
        } else if(number == 2) {
          this.ts.error("Eliga al menos una temática porfavor", "", {timeOut: 2000});
        } else {
          this.ts.error("Eliga un estado de conservación porfavor", "", {timeOut: 2000});
        }
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

  validateFields(): number {
    var num: number = -1;
    if(!this.validateTitle()) num = 1; //No hay título
    if(!this.validateThemes()) num = 2; //No hay temáticas
    if(!this.validateState()) num = 3; //No hay estado de conservación
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

}
