import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnChanges {

  @Input() rating!: number;
  @Output() rate = new EventEmitter<number>();

  stars: boolean[] = Array(5).fill(false);

  ngOnChanges(): void {
    this.updateStars();
  }

  updateStars(): void {
    this.stars = this.stars.map((_, index) => index < this.rating);
  }

  onClick(rating: number): void {
    this.rating = rating;
    this.updateStars();
    this.rate.emit(rating);
  }
}
