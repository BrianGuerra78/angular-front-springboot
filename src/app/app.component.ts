import { Component, OnInit, signal } from '@angular/core';
import { Product } from './models/product';
import { ProductsComponent } from './components/products.component';
import { FormComponent } from './components/form.component';
import Swal from 'sweetalert2';
import { ProductService } from './services/product.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ProductsComponent, FormComponent],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  products: Product[] = [];
  countId = signal(3);
  productSelected: Product = new Product();

  constructor(private service: ProductService){}
  
  ngOnInit(): void {
    this.service.findAll().subscribe(products => this.products = products)
    /*this.products = [{
      id: 1,
      name: 'Monitor Asus 35 pulgadas',
      price: 1000,
      description: 'El monitor es perfecto para juegos de alta resolucion!'
    },
    {
      id: 2,
      name: 'Iphone 16 Pro',
      price: 1700,
      description: 'El smartphone es excelente e incluye Apple Inteligence!'
    }]*/
  }

  addProduct(product: Product): void{
    if(product.id >0){

      this.service.update(product).subscribe(productUpdated => {
      this.products == this.products.map(prod =>{
        if(prod.id == product.id){
          return {...product}
        }
        return prod;
      })
      Swal.fire({
        title: "Producto Actualizado!",
        text: `Producto ${productUpdated.name} Actualizado con exito!`,
        icon: "success"
      });
    });
    }else {
      this.service.create(product).subscribe(productNew => {
    this.products = [... this.products, {... productNew }];
    //this.countId.update((id) => id + 1);
    Swal.fire({
      title: "Producto Creado!",
      text: `Producto ${productNew.name} Creado con exito!`,
      icon: "success"
    });
  });
    }
  }

  onUpdateProductEvent(product: Product): void{
    this.productSelected = {... product};
  }

  onRemoveProductEvent(id: number): void{
    Swal.fire({
      title: "Seguro que quieres eliminar?",
      text: "Cuidado se eliminara el producto del sistema!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.remove(id).subscribe(productDeleted => {
        this.products = this.products.filter(Product => this.productSelected.id != id);
        Swal.fire({
          title: "Producto Eliminado!",
          text: `Producto ${productDeleted.name} Eliminado con exito!`,
          icon: "success"
        });
      });
      }
    });
  }
}

