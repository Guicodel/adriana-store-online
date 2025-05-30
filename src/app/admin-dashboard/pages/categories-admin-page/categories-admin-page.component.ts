import { Component, inject, signal } from '@angular/core';
import { SectionsService } from '../../../shared/sections.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { CategoriesService } from '../../../categories/services/categories.service';
import { tap } from 'rxjs';
import { FormErrorLabelComponent } from '../../../shared/components/form-error-label/form-error-label.component';
import { newCategory, Category } from '../../../categories/interfaces/category.inteface';

@Component({
  selector: 'app-categories-admin-page',
  imports: [ReactiveFormsModule,FormErrorLabelComponent],
  templateUrl: './categories-admin-page.component.html',
})
export class CategoriesAdminPageComponent { 

      sectionsService = inject(SectionsService);
      categoriesServices = inject(CategoriesService);
      sections = signal(this.sectionsService.sections);
      arrayDictionarySection = signal(this.sectionsService.dictionaySections);
      selectedSection = signal('');
      title = signal<any>('Todas las Categorias');
      showError = false;
      formTitle = signal('NUEVA CATEGORIA');
      categoryIdUpdated = '';//esta propiedad se usa para poder asignarle el id de la categoria a actualizar, se manda como parametro al metodo del servicio 
      addingCategory = signal(false);// este signal se usa como control para recargar datos despues de guardar o actualizar alguna categoria
      categoryDataSave = signal(false);//este signal se usa para mostrar  el mensaje de guardado/actualizado 
      edithOption = false;// para diferenciar que acciones tomar cuando se hace el submit() del formulario
      messageError = '';
      messageControl= signal(false);
      messageSave = 'La nueva categoría se guardo correctamente';
      messageUpdate = 'La categoría se actualizo correctamente';
      originalValues = {
        name: '',
        section: '',
      };
      categoryToUpdate = {
        name:'',
        section:''
      }

      fb = inject(FormBuilder);

      categoryForm = this.fb.group({
        name : ['',Validators.required],
        section:['',Validators.required]
      });

      categoriesResource = rxResource({
        request:()=>({section:this.selectedSection(),band:this.addingCategory()}),
        loader:({request})=>{
          return this.categoriesServices.getCategoriesBySection(request.section)
          .pipe(tap(()=>this.addingCategory.set(false)));
        }
      });
      onSelectedSectionChange(section:string){
        console.log('se cambia el selector', section);
        this.selectedSection.set(section);
        this.title.set(this.sections().get(section));
      }
      async onSubmit(){
        const isValid = this.categoryForm.valid;
        console.log(this.categoryForm.value,{isValid});
        this.categoryForm.markAllAsTouched();
        if(!isValid)return;
        if(!this.edithOption){

          this.categoriesServices.createCategory(this.categoryForm.value as newCategory).subscribe({
            next: (data) => {
              console.log('✅ Respuesta exitosa:', data);
              // Aquí puedes actualizar signals, formularios, etc.
              this.messageControl.set(false);
              this.categoryDataSave.set(true);
              setTimeout(()=>{
                this.categoryDataSave.set(false);
              },3000);
              //this.onSelectedSectionChange('EN OFERTA');
              this.addingCategory.set(true);
              //this.onSelectedSectionChange(this.categoryForm.value.section!.toUpperCase());
              //this.selectedSection.set(this.categoryForm.value.section!);
              console.log('esta es la seccion que debe cargar :',this.categoryForm.value.section)
              this.onCancel();
            },
            error: (error) => {
              console.log('Error en la solicitud:', error.error);
              this.showMessageError(error.error.msg);
              // Manejo de errores: mostrar alerta, redirigir, etc.
            }
          });
          // //console.log(`esta es la respuesta de la api${data}`);
        }
        else{
            if(this.categoryForm.value.name===this.categoryToUpdate.name)
            {
                const data={
                  section:this.categoryForm.value.section
                }
                this.categoriesServices.updateCategory(this.categoryIdUpdated,data as Category).subscribe({
                next: (data) => {
                console.log('✅ Respuesta exitosa:', data);
                  // Aquí puedes actualizar signals, formularios, etc.
                  this.messageControl.set(true);
                  this.categoryDataSave.set(true);
                  setTimeout(()=>{
                    this.categoryDataSave.set(false);
                  },3000);
                  this.edithOption = false;
                  this.addingCategory.set(true);
                  console.log('esta es la seccion que debe cargar :',this.categoryForm.value.section);
                  this.onCancel();
                },
                error: (error) => {
                  console.log('Error en la solicitud:', error.error);
                  this.showMessageError(error.error.msg);
                }
              });
            }
            else{
                this.categoriesServices.updateCategory(this.categoryIdUpdated,this.categoryForm.value as Category).subscribe({
                next: (data) => {
                console.log('✅ Respuesta exitosa:', data);
                  // Aquí puedes actualizar signals, formularios, etc.
                  this.messageControl.set(true);
                  this.categoryDataSave.set(true);
                  setTimeout(()=>{
                    this.categoryDataSave.set(false);
                  },3000);
                  this.edithOption = false;
                  this.addingCategory.set(true);
                  console.log('esta es la seccion que debe cargar :',this.categoryForm.value.section);
                  this.onCancel();
                },
                error: (error) => {
                  console.log('Error en la solicitud:', error.error);
                  this.showMessageError(error.error.msg);
                }
              });
            }
         
        }
        this.formTitle.set('NUEVA CATEGORIA');
      }
      onCancel(){
        this.categoryForm.reset(this.originalValues);
        this.categoryForm.markAsPristine();
        this.categoryForm.markAsUntouched();
        this.edithOption = false;
        this.formTitle.set('NUEVA CATEGORIA');
        //this.categoryForm.updateValueAndValidity();

      }
      showMessageError(error:string){
          this.messageError = error || 'Error al ejecutar la operacion.';
          this.showError = true;
      }
      onModalAccept()
      {
        this.showError = false;
      }
      onEdithPush(id:string,name:string,section:string){
        //console.log(id,name, section);
        this.formTitle.set('ACTUALIZAR CATEGORIA');
        this.edithOption=true;
        this.categoryIdUpdated = id;
        this.categoryToUpdate.name = name;
        this.categoryToUpdate.section = section;
        this.categoryToUpdate={
          name:name,
          section:section
        }
        this.categoryForm.reset({name:name,section:section});
      }
}
