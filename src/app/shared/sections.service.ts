import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  private sectionsStore = ['Prendas de vestir','Disfraces','Accesorios para el hogar','Juguetes ','En oferta'];
  private dictionary = new Map<string, string>([
  ['PRENDAS DE VESTIR', 'Prendas de vestir'],
  ['DISFRACES', 'Disfraces'],
  ['ACCESORIOS PARA EL HOGAR', 'Accesorios para el hogar'],
  ['JUGUETES', 'Juguetes'],
  ['EN OFERTA', 'En oferta']
]);
  private upperCaseSections = ['PRENDAS DE VESTIR','DISFRACES','ACCESORIOS PARA EL HOGAR','JUGUETES','EN OFERTA'];
  private sectionsTranslate = Array.from(this.dictionary.entries());
  get upperSections(){
    return this.upperCaseSections
  }

  get sections(){
    return this.dictionary;
  }
  get dictionaySections(){
    return this.sectionsTranslate
  }
  get sectionsStoreEs(){
    return this.sectionsStore;
  }
}
