import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterPublicationAdmin'
})

export class FilterPublicationAdminPipe implements PipeTransform{

    transform(value: any, arg: any, arg2: any, arg3: any, arg4: any, totalItems : number): any {
        //console.log(arg + " -- " + arg2 + " -- " + arg3 + " -- " + arg4 + " -- ");
        totalItems = 0;
        if(!this.validation(arg, arg2, arg3, arg4)) return value;
        const resultPublication = [];
        for(const pub of value){
            if(this.includesSearch(arg, arg2, arg3, arg4, pub)){
                resultPublication.push(pub);
                totalItems++;
            }
        }
        return resultPublication;
    }

    validation(arg: any, arg2: any, arg3:any, arg4:any) : boolean {
        
        if(arg === undefined || arg2 === undefined 
            || arg3 === undefined || arg4 === undefined) return false;
        if(arg.length < 1 && arg2.length < 1  
            && arg3.length < 1 && arg4.length < 1 ) return false;
        return true;
    }

    includesSearch(arg: any, arg2: any, arg3:any, arg4: any, pub: any) : boolean{

        //PID //Title //Grafiter //State
        if(pub.pid.toLowerCase().indexOf(arg.toLowerCase()) < 0
            || pub.title.toLowerCase().indexOf(arg2.toLowerCase()) < 0
            || pub.graffiter.toLowerCase().indexOf(arg3.toLowerCase()) < 0
            || pub.state.toLowerCase().indexOf(arg4.toLowerCase()) < 0) {
            
            return false;
        }

        return true;
    }
}