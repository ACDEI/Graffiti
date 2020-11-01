export class Place{
    
    pmid: string;
    isMonument: boolean;

    constructor(pmid: string, isMonument: boolean){
        this.pmid = pmid;
        this.isMonument = isMonument;
    }

    /*
    public getPmid (){ return this.pmid; }

    public getIsMonument(){ return this.isMonument; }

    public setIsMonument(isMonument: boolean){
        this.isMonument = isMonument;
    }
    */
}