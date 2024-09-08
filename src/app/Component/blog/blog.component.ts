import { Component, OnInit } from '@angular/core';
import { PublicationService } from 'src/app/Services/publication.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  publications: any[] = [];
  pdfs: any[] = [];
  videos: any[] = [];
  images: any[] = [];
  docs: any[] = [];
  newReview: any = { rating: 0, message: '' };
  selectedPublicationId: string | null = null;

  constructor(private publicationService: PublicationService) { }

  ngOnInit(): void {
    this.getPublications();
  }

  getPublications(): void {
    this.publicationService.getPublications().subscribe(data => {
      this.publications = data;
      this.publications.forEach(pub => this.getReviews(pub));
      this.separatePublications();
    });
  }

  separatePublications(): void {
    this.publications.forEach(pub => {
      if (pub.pdfIds) {
        pub.pdfIds.forEach((id: string) => this.pdfs.push({ ...pub, fileId: id }));
      }
      if (pub.videoIds) {
        pub.videoIds.forEach((id: string) => this.videos.push({ ...pub, fileId: id }));
      }
      if (pub.imageIds) {
        pub.imageIds.forEach((id: string) => this.images.push({ ...pub, fileId: id }));
      }
      if (pub.docIds) {
        pub.docIds.forEach((id: string) => this.docs.push({ ...pub, fileId: id }));
      }
    });
  }

  getFileUrl(fileId: string): string {
    return this.publicationService.getFileUrl(fileId);
  }

  getReviews(publication: any): void {
    this.publicationService.getReviewsByPublicationId(publication.id).subscribe(data => {
      publication.reviews = data;
      publication.averageRating = this.calculateAverageRating(data);
    });
  }

  calculateAverageRating(reviews: any[]): number {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  }

  toggleReviewForm(publicationId: string | null, rating?: number): void {
    this.selectedPublicationId = publicationId;
    if (!publicationId) {
      this.newReview = { rating: 0, message: '' };
    } else if (rating) {
      this.newReview.rating = rating;
    }
  }

  addOrUpdateReview(): void {
    if (this.selectedPublicationId) {
      this.publicationService.addReview(this.selectedPublicationId, this.newReview).subscribe(() => {
        this.getReviewsById(this.selectedPublicationId!); 
        this.toggleReviewForm(null);
      });
    }
  }

  getReviewsById(publicationId: string): void {
    const publication = this.publications.find(pub => pub.id === publicationId);
    if (publication) {
      this.publicationService.getReviewsByPublicationId(publicationId).subscribe(data => {
        publication.reviews = data;
        publication.averageRating = this.calculateAverageRating(data);
      });
    }
  }
}