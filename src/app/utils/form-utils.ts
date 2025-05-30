import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms"

export class FormUtils{
     
    static isValidField(form:FormGroup, fieldName: string): boolean | null{
         return (
            !!form.controls[fieldName].errors && form.controls[fieldName].touched
         )
    }

    static getFieldError(form:FormGroup, fieldName:string): string | null{

        const errors = form.controls[fieldName].errors ?? {};
        for(const key of Object.keys(errors)){
            switch(key){
                case 'required':
                    return 'Este campo es requerido';
                case 'mingLength':
                    return `Mínimo de ${errors['minLength'].requiredLength} caracteres requerido`;
                case 'min':
                    return `Valor mínimo de ${errors['min'].min}`;
                case 'email':
                    return 'El correo electrónico no es válido';
                
            }
        }
        return null;
    }
    static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'email':
          return `El valor ingresado no es un correo electrónico`;

        case 'emailTaken':
          return `El correo electrónico ya está siendo usado por otro usuario`;

        // case 'noStrider':
        //   return `No se puede usar el username de strider en la app`;

        // case 'pattern':
        //   if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
        //     return 'El valor ingresado no luce como un correo electrónico';
        //   }

        //   return 'Error de patrón contra expresión regular';

        default:
          return `Error de validación no controlado ${key}`;
      }
    }

    return null;
  }
    static isFieldOneEqualFieldTwo(field1: string, field2: string){
        return (formGroup:AbstractControl)=>{
            const fiel1dValue = formGroup.get(field1)?.value;
            const field2Value = formGroup.get(field2)?.value;
            return fiel1dValue === field2Value ? null : { fieldsNotEqual:true};
        }
        
    }
}