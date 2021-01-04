import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { PublicationsService } from '@core/services/classes_services/publications.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  uid:string; 
  conectadoFlickr = false ; 
  selectedFile: File = null;
  showButton = false; 
  statusSelector:string;
  themeSelector:string [];
  graffitiTitle:string;
  graffiterName:string;
  oauth_token:string;
  oauth_verifier:string; 
  idToken : string;

  constructor(private auth: AuthService, private http: HttpClient, private route: Router , private ps: PublicationsService) {
   }

  ngOnInit(): void {
    var usuario= JSON.parse(window.sessionStorage.getItem("usuario"));
    this.uid = usuario.uid;
    this.conectadoFlickr = JSON.parse(window.sessionStorage.getItem("oauth_verifier"));
    //console.log(this.conectadoFlickr);
    this.oauth_verifier = JSON.parse(window.sessionStorage.getItem("oauth_verifier"));
    //console.log(this.oauth_verifier);
    this.oauth_token = JSON.parse(window.sessionStorage.getItem("oauth_token"));
    //console.log(this.oauth_token);
  }

  cerrarSesion(){
    this.uid = "";
    this.auth.signOut();
  }

  conectarFlickr(){

    //let url = "http://localhost:5001/graffiti-9b570/us-central1/APIRest/flickr/conectar";
    let url = "http://localhost:5001/graffiti-9b570/us-central1/MalagArtApiWeb/flickr/conectar";
  
    let result = this.http.get<any>(url);
  
    result.subscribe(data =>{
      console.log(data.url);
      /// si el usuario acepta flickr devolverá un callback a la home del usuario en malagart
      //this.route.navigateByUrl(data.url);
      window.location.href= data.url; 
    })

  }


  subirImagen(){

     const formData : FormData = new FormData();  
     formData.append('file', this.selectedFile, this.selectedFile.name);
     formData.append('oauth_token',this.oauth_token);
     formData.append('oauth_verifier', this.oauth_verifier);
     formData.append('title',this.graffitiTitle);
 
   
     //let url = "http://localhost:5001/graffiti-9b570/us-central1/APIRest/flickr/upload";
     let url = "http://localhost:5001/graffiti-9b570/us-central1/MalagArtApiWeb/flickr/upload"
   
     let result = this.http.post<any>(url,formData);
   
     result.subscribe(data =>{
       //console.log(data);
       //TODO
       //data.id está la id para construir la url de flickr
       //realizar desde aquí el storage en bbdd de la url de la foto y los demás atributos grafitero etc...
       let urlPhoto = "https://www.flickr.com/photos/191586112@N04/" + data.id; 
       console.log(data);
       //TODO lat y long 

       let photo : any = { "state": this.statusSelector, "theme": this.themeSelector ,
       "title": this.graffitiTitle, "name": this.graffiterName }
       this.ps.postPublicationCF(photo);

      })
     
     this.showButton = false; 
   
   }

   onFileSelected(event){
     this.showButton = true; 
     this.selectedFile =<File>event.target.files[0];
   }

}
