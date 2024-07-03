import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { RouterModule } from '@angular/router';
import { DashboardMainComponent } from '../dashboard-main/dashboard-main.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('slideInOut', [
      state('collapsed', style({ height: '0px', overflow: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed <=> expanded', [animate('200ms ease-in-out')]),
    ]),
  ],
})
export class DashboardComponent {
  @ViewChild('menu', { static: true }) menuRef: ElementRef | any;
  @ViewChild('sidebar', { static: true }) sidebarRef: ElementRef | any;

  isActive = false;
  submenuState: any = {}; // Keeps track of submenu states (collapsed/expanded)

  toggleMenuItem(menuItem: any) {
    menuItem.closest('li').classList.toggle('active');

    const submenu = menuItem.closest('li').querySelector('ul') as any; // Get the submenu element
    console.log(submenu, submenu.style.display)
    if(submenu.style.display!='block'){
      submenu.style.display = 'block'
    }else{
      submenu.style.display = 'none'
    }
    submenu?.classList.remove('active'); // Remove active class from submenu (optional)

    // this.deactivateOtherMenuItems(menuItem);
  }

  deactivateOtherMenuItems(clickedItem: any) {
    const menu = document.querySelector('.menu') as any
    menu
      .querySelectorAll('li')
      .forEach(
        (item: {
          classList: { remove: (arg0: string) => void };
          querySelector: (arg0: string) => any;
          dataset: { submenuId: string | number };
        }) => {
          if (item !== clickedItem) {
            item.classList.remove('active');
            const submenuItem = item.querySelector('ul');
            if (submenuItem) {
              submenuItem.classList.remove('active'); // Remove active class from submenu (optional)
              submenuItem.classList.add('collapsed'); // Ensure submenu is collapsed
              this.submenuState[item.dataset.submenuId] = 'collapsed'; // Update state
            }
          }
        }
      );
  }

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar') as any
    sidebar.classList.toggle('active');
    this.isActive = !this.isActive;
  }

  // @HostListener('document:click', ['$event'])
  // handleClickOutside(event: MouseEvent) {
  //   const menu = document.querySelector('.menu') as any
  //   if (!menu.contains(event.target) && this.isActive) {
  //     this.toggleSidebar();
  //   }
  // }
}
