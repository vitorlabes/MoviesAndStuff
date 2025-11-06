import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isOpen = input<boolean>(true);
  toggleSidebar = output<void>();

  menuItems: MenuItem[] = [
    { label: 'Movies', icon: '🎬', route: '/movies' },
    { label: 'Games', icon: '🎮', route: '/games' },
    { label: 'Series', icon: '📺', route: '/series' },
    { label: 'Favorites', icon: '⭐', route: '/favorites' },
    { label: 'Statistics', icon: '📊', route: '/stats' }
  ];

  onToggle() {
    this.toggleSidebar.emit();
  }
}
