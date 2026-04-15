import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { PerfilConfig } from '../models/nav.models';

@Component({
  selector: 'app-barra-superior',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './barra-superior.component.html',
  styleUrls: ['./barra-superior.component.scss']
})
export class BarraSuperiorComponent {
  @Input() perfil: PerfilConfig = {};
  @Input() buscarPlaceholder = 'Buscar...';
}
