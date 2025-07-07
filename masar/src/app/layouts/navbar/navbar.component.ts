import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  openDropdown: string | null = null;

toggleDropdown(event: Event, menu: string) {
    event.preventDefault(); // Prevent the link from navigating
    event.stopPropagation(); // Stop Bootstrap from closing the menu

    const target = event.target as HTMLElement;
    const subMenu = target.nextElementSibling as HTMLElement;

    // Close all other submenus
    document.querySelectorAll('.sub-menu.open').forEach(menu => {
        if (menu !== subMenu) menu.classList.remove('open');
    });

    // Toggle the clicked submenu
    if (subMenu) {
        subMenu.classList.toggle('open');
    }
    this.openDropdown = this.openDropdown === menu ? null : menu;

}

}
