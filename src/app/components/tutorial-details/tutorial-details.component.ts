import { Component, Input, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css'],
})
export class TutorialDetailsComponent implements OnInit {
  @Input() viewMode = false;

  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    published: false
  };

  message = '';

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      this.getTutorial(Number(this.route.snapshot.params['id'])); // Convert id to number
    }
  }

  getTutorial(id: number): void { // Change id type to number
    this.tutorialService.get(id).subscribe({
      next: (data) => {
        this.currentTutorial = data;
      },
      error: (e) => console.error(e)
    });
  }

  updatePublished(status: boolean): void {
    const data = {
      title: this.currentTutorial.title,
      description: this.currentTutorial.description,
      published: status
    };

    this.tutorialService.update(this.currentTutorial.id!, data).subscribe({ // Use non-null assertion
      next: (res) => {
        this.currentTutorial.published = status;
        this.message = (res as any).message || 'The status was updated successfully!'; // Cast to any to access message
      },
      error: (e) => console.error(e)
    });
  }

  updateTutorial(): void {
    this.tutorialService.update(this.currentTutorial.id!, this.currentTutorial).subscribe({ // Use non-null assertion
      next: (res) => {
        this.message = (res as any).message || 'This tutorial was updated successfully!'; // Cast to any to access message
      },
      error: (e) => console.error(e)
    });
  }

  deleteTutorial(): void {
    this.tutorialService.delete(this.currentTutorial.id!).subscribe({ // Use non-null assertion
      next: (res) => {
        this.router.navigate(['/tutorials']);
      },
      error: (e) => console.error(e)
    });
  }
}