import { Pipe, PipeTransform } from '@angular/core';

// Pipe de traitement des listes
@Pipe({ name: 'capteurPipe' })
export class PipeCapteur implements PipeTransform {
  
  public transform(values: any[], filtre: string): any[] {
    if (!values || !values.length) return [];
    if (!filtre) return values;

    return values.filter(v => {
        if (v.reference) {
            return v.reference.indexOf(filtre.toUpperCase()) >= 0;
        }
    });
  }
}

@Pipe({ name: 'searchCapteur' })
export class SearchCapteur implements PipeTransform {
  
  typeSearch : string;
  searchValue : string;

  currentFilter : string;
  public transform(values: any[], filtre: string): any[] {
    if (!values || !values.length) return [];
    if (!filtre) return values;
    var filtreOrigin = filtre.split(":");
    this.typeSearch = filtreOrigin[0];
    this.searchValue = filtreOrigin[1];

    if(this.typeSearch == "hname"){
      this.currentFilter == "hiveName";
    }
    else if(this.typeSearch == "aname"){
      this.currentFilter == "apiaryName"
    }
    return values.filter(v => {
        if(v.type){
            return v.type.indexOf(filtre) >= 0;
        }
    });
  }
}