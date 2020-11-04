import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform{

    transform(value: any, arg: any, arg2: any, arg3: any, arg4): any {
        //console.log(arg + " -- " + arg2 + " -- " + arg3 + " -- " + arg4 + " -- ");
        if(!this.validation(arg, arg2, arg3, arg4)) return value;
        const resultUser = [];
        for(const user of value){
            if(this.includesSearch(arg, arg2, arg3, arg4, user)){
                resultUser.push(user);
            }
        }
        return resultUser;
    }

    validation(arg: any, arg2: any, arg3:any, arg4:any) : boolean {
        
        if(arg === undefined || arg2 === undefined 
            || arg3 === undefined || arg4 === undefined) return false;
        if(arg.length < 1 && arg2.length < 1  
            && arg3.length < 1 && arg4.length < 1 ) return false;
        return true;
    }

    includesSearch(arg: any, arg2: any, arg3:any, arg4: any, user: any) : boolean{

        //Admin
        if(user.isAdmin) return false;
        //UID //Name //Nick //Email
        if(user.uid.toLowerCase().indexOf(arg.toLowerCase()) < 0
            || user.fullName.toLowerCase().indexOf(arg2.toLowerCase()) < 0
            || user.nickName.toLowerCase().indexOf(arg3.toLowerCase()) < 0
            || user.email.toLowerCase().indexOf(arg4.toLowerCase()) < 0) {
            
            return false;
        }

        return true;
    }
}