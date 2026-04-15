import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { BarraLateralConfig } from '../models/nav.models';

@Component({
  selector: 'app-barra-lateral',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './barra-lateral.component.html',
  styleUrls: ['./barra-lateral.component.scss']
})
export class BarraLateralComponent {
  @Input() config: BarraLateralConfig = {
    titulo: 'Mi App',
    subtitulo: '',
    logoUrl: '',
    grupos: []
  };
}
