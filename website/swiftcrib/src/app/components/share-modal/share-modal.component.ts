import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './share-modal.component.html',
  styleUrl: './share-modal.component.scss',
})
export class ShareModalComponent {
  isModalOpen = false;
  @Input() url: string | undefined = '';

  openModal() {
    this.isModalOpen = true;
  }

  closeModal($event: any) {
    const shareModal = document.querySelector('.share-modal') as any;
    if (
      Array.from($event.target.classList).includes('share-modal') ||
      Array.from($event.target.classList).includes('close')
    ) {
      shareModal.classList.remove('show');
      shareModal.style.display = 'none';
    }
  }
}
