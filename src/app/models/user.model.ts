import { Place } from './place.model';

export class User {
    
    uid: string;
    email: string;
    fullName: string;
    nickName: string;
    photoURL: string;
    isAdmin: boolean;
	likes: string[];
    followers: string[];
    followed: string[];
    visited: Place[];
	
    constructor(){

    }

    /*
    //Getters - Setters
    public getUID(){ return this.uid; }

    public getEmail(){ return this.email; }

    public setEmail(email: string){ this.email = email; }

    public getFullName(){ return this.fullName; }

    public setFullName(fullName: string){ this.fullName = fullName; }

    public getNickName(){ return this.nickName; }

    public setNickName(nickName: string){ this.nickName = nickName; }

    public getPhotoUrl(){ return this.photoURL; }

    public setPhotoUrl(photoUrl: string){ this.photoURL = photoUrl; }

    public getIsAdmin(){ return this.isAdmin; }

    
    public setIsAdmin(isAdmin: boolean){ this.isAdmin = isAdmin; }
    

    public addLikes(pid: string){ this.likes.push(pid); }

    public removeLikes(pid: string) { this.likes = this.likes.filter( item => item != pid); }

    public addFollower(uid: string){ this.followers.push(uid); }

    public removeFollower(uid: string) { this.followers = this.followers.filter( item => item != uid); }

    public addFollowed(uid: string){ this.followed.push(uid); }

    public removeFollowed(uid: string) { this.followed = this.followed.filter( item => item != uid); }

    //public addVisited(pmid: string, isMonument: boolean){ this.visited.push(new Place(pmid, isMonument); }

    //public removeVisited(pmid) { this.visited = this.visited.filter( item => item.pmid != pmid); }
*/
}
