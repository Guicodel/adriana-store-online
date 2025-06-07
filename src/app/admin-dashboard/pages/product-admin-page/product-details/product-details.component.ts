import { Component, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '../../../../products/interfaces/product.interface';
import { ProductCarouselComponent } from '../../../../products/components/product-carousel/product-carousel.component';
import { SectionsService } from '../../../../shared/sections.service';
import { CategoriesService } from '../../../../categories/services/categories.service';
import { CategoriesResponse } from '../../../../categories/interfaces/category.inteface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormErrorLabelComponent } from '../../../../shared/components/form-error-label/form-error-label.component';
import { ProductsService } from '../../../../products/services/products.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent,ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit{
        product = input.required<Product>();
        router = inject(Router);
        sectionsService = inject(SectionsService);
        categoriesService = inject(CategoriesService);
        productsService = inject(ProductsService);
        sections = signal(this.sectionsService.upperSections);
        //initialCategories = signal([]);
        tempImages = signal<string[]>([]);
        imageFileList:FileList | undefined = undefined;
        messageSave = 'El producto ha sido guardado correctamente';
        messageUpdate = 'El producto ha sido actualizado correctamente';
        showMessage = signal(false);
        showModalError = signal(false);
        messageErrorFromApi = '';
        categoriesBySections = signal<CategoriesResponse>({total:0,categories:[]});
        gender = ['Varón','Mujer','Niños','Unisex'];
        saveDataOption = true;
        //hasClothesAtributes = signal(true);
        fb = inject(FormBuilder);
        productForm = this.fb.group({
          name: ['',Validators.required],
          section: ['',Validators.required],
          category: ['',Validators.required],
          description:['',Validators.required],
          price:[0,[Validators.required,Validators.min(0)]],
          stock:[0,[Validators.required,Validators.min(0)]],
          size:[['']],
          brand:[''],
          gender:[''],
          img:[['']]

        });
        constructor(private location:Location)
        {
            //if(this.product().section==='DISFRACES' || this.product().section === 'PRENDAS DE VESTIR')
            const destroyRef = inject(DestroyRef);
                effect(() => {
            const value = this.product().section;

            if (value) {
              this.categoriesService.getCategoriesBySection(value)
                .pipe(takeUntilDestroyed(destroyRef))
                .subscribe({
                next: (res) => this.categoriesBySections.set(res),
                error: (err) => {
                  console.error('Error al obtener datos:', err);
                  this.categoriesBySections.set({total:0,categories:[]});
                }
              });
            }
          });
         }
        onProductFormChanged = effect((onCleanup)=>{
          const sectionSubscription = this.onSectionChanged();
          onCleanup(()=>{
            sectionSubscription.unsubscribe();
          })
        });
        onSectionChanged(){
          return this.productForm.get('section')!.valueChanges.pipe(
            tap(()=>this.productForm.get('category')!.setValue('')),
            tap(()=>this.categoriesBySections.set({total:0,categories:[]})),
            switchMap((section)=>
              this.categoriesService.getCategoriesBySection(section!),

            )
          )
          .subscribe((categories)=>{

            this.categoriesBySections.set(categories);
          }
          );
        }
      sizes = ['XL','XXXL','M','L','S'];
      ngOnInit(): void {
        this.setFormValue(this.product());
        
      }
      setFormValue(productLike: Partial<Product>){
        this.productForm.patchValue(productLike);
        this.productForm.patchValue({category:productLike.categoryId?.name});
        // console.log('este es el productLike=> ',productLike);
        // console.log('aqui se asigna inicial al formulario con esta data=> ',this.productForm.value);
        
      }
      onSizeClicked(size:string){
        const currentSizes = this.productForm.value.size ?? [];
        if(currentSizes.includes(size)){
          currentSizes.splice(currentSizes.indexOf(size),1);
        }
        else{
          currentSizes.push(size);
        }
        this.productForm.patchValue({size:currentSizes});
      }
      onSubmit(){
        const isValid = this.productForm.valid;
        this.productForm.markAllAsTouched();
        if(!isValid)return;
        const formValue = this.productForm.value;
        const categoryName = this.productForm.value.category;
        const categorySelected = this.categoriesBySections().categories.find(n => n.name===categoryName);
        let productLike: Partial<Product>={
          ...(formValue as any),
          categoryId:categorySelected?._id ?? ''
        };

        if(this.product()._id === 'new'){
          this.saveDataOption = true;
            this.productsService.createProduct(productLike,this.imageFileList).subscribe({
              next:(product)=>{
                  //this.router.navigate(['/admin/products',product._id]);
                  if(this.imageFileList)
                  {
                    const { name, ...newProduct} = productLike
                    this.productsService.updateProduct(product._id, newProduct,this.imageFileList).subscribe({
                    next:(data)=>{
                        console.log('se creo correctamente el producto con imagenes');
                        // this.showMessage.set(true);
                        // setTimeout(()=>{
                        //       this.showMessage.set(false);
                        //       this.location.back();
                        //     },2000);
                        },
                        error:(error)=>{
                          console.log('este error se muestra al crear con imagenes', error);
                          
                        }
                      })
                  }
                  this.showMessage.set(true);
                  setTimeout(()=>{
                        this.showMessage.set(false);
                        this.location.back();
                      },2000);
              },
              error:(error)=>{
                   console.log('error', error);
                    this.showModalError.set(true);
                    this.messageErrorFromApi=error.error.msg;
              }
            })
        }
        else
        {
            this.saveDataOption = false
            if(this.product().name.toUpperCase() === productLike.name?.toUpperCase())
            {
              const {name, ...productTosave} = productLike;
              productLike = productTosave;
            }
            this.productsService.updateProduct(this.product()._id, productLike,this.imageFileList).subscribe({
              next:(data)=>{
                  
                  this.showMessage.set(true);
                  setTimeout(()=>{
                        this.showMessage.set(false);
                        this.location.back();
                      },2000);
              },
              error:(error)=>{
                    console.log('error', error);
                    this.showModalError.set(true);
                    this.messageErrorFromApi=error.error;
                    
    
              }
            })
        }
      }
      onModalAccept(){
        this.showModalError.set(false);
      }

      //manejo de imagenes
      onFilesChanged(event:Event){
          this.tempImages.set([]);
          const fileList =(event.target as HTMLInputElement).files;
          this.imageFileList = fileList ?? undefined;
          const imagesUrls = Array.from(fileList ?? []).map((file)=>
            URL.createObjectURL(file)
          );
          this.tempImages.set(imagesUrls);
      }
      deleteTempImg(index:number){
        this.tempImages().splice(index,1);
      }
 }
