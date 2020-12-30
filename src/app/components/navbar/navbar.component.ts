import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

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
  graffitiTitle:string;
  graffiterName:string;
  oauth_token:string;
  ouath_verifier:string; 

  constructor(private auth: AuthService, private http: HttpClient, private route: Router) {
   }

  ngOnInit(): void {
    var usuario= JSON.parse(window.sessionStorage.getItem("usuario"));
    this.conectadoFlickr = JSON.parse(window.sessionStorage.getItem("oauth_verifier"));
    this.ouath_verifier = JSON.parse(window.sessionStorage.getItem("oauth_verifier"));
    this.oauth_token = JSON.parse(window.sessionStorage.getItem("oauth_token"));
    this.uid = usuario.uid;
  }

  cerrarSesion(){
    this.uid = "";
    this.auth.userSelected = null; 
    this.auth.signOut();
  }

  conectarFlickr(){
    this.conectadoFlickr = true; 

    let url = "http://localhost:5001/graffiti-9b570/us-central1/APIRest/flickr/conectar";
  
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
     formData.append('oauth_verifier', this.ouath_verifier);
     formData.append('title',this.graffitiTitle);
 
   
     let url = "http://localhost:5001/graffiti-9b570/us-central1/APIRest/flickr/upload";
   
     let result = this.http.post<any>(url,formData);
   
     result.subscribe(data =>{
       console.log(data);
       //TODO
       //data.id está la id para construir la url de flickr
       //realizar desde aquí el storage en bbdd de la url de la foto y los demás atributos grafitero etc...
     })
   
     this.showButton = false; 
   
   }

   onFileSelected(event){
     this.showButton = true; 
     this.selectedFile =<File>event.target.files[0];
   }

}
