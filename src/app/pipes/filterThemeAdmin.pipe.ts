import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterThemeAdmin'
})

export class FilterThemeAdminPipe implements PipeTransform{

    transform(value: any, arg: any, totalItems : number): any {
        totalItems = 0;
        if(!this.validation(arg)) return value;
        const resultThemes = [];
        for(const theme of value){
            if(this.includesSearch(arg, theme)){
                resultThemes.push(theme);
                totalItems++;
            }
        }
        return resultThemes;
    }

    validation(arg: any) : boolean {
        
        if(arg === undefined) return false;
        if(arg.length < 1) return false;
        return true;
    }

    includesSearch(arg: any, theme: any) : boolean{

        //PID //Title //Grafiter //State
        if(theme.name.toLowerCase().indexOf(arg.toLowerCase()) < 0) {
            return false;
        }

        return true;
    }
}