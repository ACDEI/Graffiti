import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { User } from '@core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCollection: AngularFirestoreCollection<User>;

  private path = '/users';

  constructor(private fs: AngularFirestore) { 
    this.userCollection = fs.collection(this.path);
    //this.userList = this.fireservices.collection("usuarios").valueChanges();
  }

  

  /*  //Usar donde creemos el usuario
      //-> necesario importar el userService
    createRecord(){
      let Record = {};
      Record['name'] = this.variables;
      ...

      //Llama al método crear de aquí
      this.userService.create_NewUser(Record).then(res => {
        //Lo que queramos hacer si tenemos éxito
        ... 

      }).catch(error => {
        //Idem si Falla
        console.log(error);
      })
    }
  */

  // Insert Usert in DB
  createUser(user: User) : any{
    return this.fs.collection('users').doc(user.uid).set(user); //Guarda el UID correcto
    //this.userCollection.add({...user});
  }


  /*
    //Cuando queramos retornar la lista en algún componente.
    this.userService.get_AllUsers().subscribe(data => {
      this.user = data.map(e => {
        return {
          id: e.payload.doc.id;
          name: e.payload.doc.data()['name'];  //obtener el nombre del usuario, p.e.
          ...
        }
      })
    }) 

  */

  // Return User's List from the DB
  get_AllUsers() : AngularFirestoreCollection<User> {
    return this.userCollection;
  }

 /*getAllUsersList() {
   let userList : AngularFirestoreCollection<User>;
     this.get_AllUsers().subscribe(users => {
        userList = users.map(e => {
          return {
            uid: e.payload.doc.id,
            email: e.payload.doc.data()['email'],
            fullName: e.payload.doc.data()['fullName'],
            nickName: e.payload.doc.data()['nickName'],
            photoURL: e.payload.doc.data()['photoURL'],
            isAdmin: e.payload.doc.data()['isAdmin'],
            likes: e.payload.doc.data()['likes'],
            followers: e.payload.doc.data()['followers'],
            followed: e.payload.doc.data()['followed'],
            visited: e.payload.doc.data()['visited']
          }
      });
      console.log(userList); //Imprime bien a lista
    });
    return userList;  //Undefined
  }
  */
  /*
    getAllUsersList() : User[] {
      let userList : User[] = [];
      this.get_AllUsers().subscribe(users => {
        users.map(e => {
          userList.push({
            uid: e.payload.doc.id,
            email: e.payload.doc.data()['email'],
            fullName: e.payload.doc.data()['fullName'],
            nickName: e.payload.doc.data()['nickName'],
            photoURL: e.payload.doc.data()['photoURL'],
            isAdmin: e.payload.doc.data()['isAdmin'],
            likes: e.payload.doc.data()['likes'],
            followers: e.payload.doc.data()['followers'],
            followed: e.payload.doc.data()['followed'],
            visited: e.payload.doc.data()['visited']
          });
        });
      });
      return userList;
    }
    */

  getUser(uid: string){
    //this.userRef = this.fs.object('users/' + uid);
    //return this.userRef;
  }

  /*
    //PARA EDITAR DATOS
      EditRecord(Record){
        Record.editx = Record.x;  x es el nombre de variable usado
        ...

      }


      UpdateRecord(recordData){

        let record = {};
        record['x'] = recordData.x;
        ...

        this.userService.update_User(recordData.id, record);
      }
  */

  // Update an User From DB
  update_User(uid: string, recordData){
    this.fs.doc('users/' + uid).update(recordData);
  }

  updateUser(user: User) : Promise<void>{
    //delete user.uid;
    return this.fs.doc('users/' + user.uid).update(user);
    //return this.userCollection.doc(user.uid).update(user);
  }
  /*
    deleteUser(uid){
      this.userService.delete_User(uid)
    }

  */
  delete_User(uid: string) : Promise<void>{
    //this.fs.doc('users/' + uid).delete();
    return this.userCollection.doc(uid).delete();
  }
}
