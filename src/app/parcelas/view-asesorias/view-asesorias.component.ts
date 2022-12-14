import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { Receta } from 'src/app/models/receta';

import { ServiciosService } from 'src/app/services/servicios.service';
import { RecetaPdf } from '../../utils/recetaPDF';

@Component({
  selector: 'app-view-asesorias',
  templateUrl: './view-asesorias.component.html',
  styleUrls: ['./view-asesorias.component.css']
})
export class ViewAsesoriasComponent implements OnInit {
  public idpar: any = []
  public iduser: any = []
  public asesorias: any = []
  constructor(private auth: AuthGuard, private _ServiciosService: ServiciosService, private router: Router, private _AuthGuard: AuthGuard, private _activatedRoute: ActivatedRoute, private route: Router) {
    this.Paginate()
  }
  public exist: any = []
  config: any = []
  Paginate() {
    this.config = {
      id: 'basicPaginate',
      itemsPerPage: 2,
      currentPage: 1,
      totalItems: this.asesorias.length
    };
  }
  ngOnInit(): void {
    this.exist = this._AuthGuard.IsIng()
    console.log(this.iduser);

    this.idpar = this._activatedRoute.snapshot.paramMap.get('id');
    this.getReceta()

  }

  getReceta() {
    console.log("sda");
    console.log("asesorais------------------------------------");

    this._ServiciosService.getRecetasProductor(this.idpar).subscribe(data => {
      this.asesorias = data

      if (data.length == 0) {
        this._ServiciosService.getRecetasParcela(this.idpar).subscribe(data => {
          this.asesorias = data
        }, error => {
        });
      }
    }, error => {

    });

  }
  pageChanged(event: any) {
    this.config.currentPage = event;
  }

  CrearPdf(event: any) {
    console.log(event);

    let obj = this.auth.IsIDOj()
    const Receta2: any = {
      productor: event.productor.nombre+' '+event.productor.apellidoPa+' '+event.productor.apellidoMa,
      ingeniero:  event.ingeniero.nombre+' '+event.ingeniero.apellidoPa+' '+event.ingeniero.apellidoMa,
      cultivo: event.parcela.cultivo,
      cuidad: event.parcela.cuidad,
      contacto: event.productor.telefono,
      ejido: event.parcela.nombre,
      suelos: event.suelos,
      foliares: event.foliares,
      novista: event.nov,
      correo: obj.correo,
      telefono: obj.telefono,
      fecha: event.fecha
    }
    RecetaPdf(Receta2)

  }
}
