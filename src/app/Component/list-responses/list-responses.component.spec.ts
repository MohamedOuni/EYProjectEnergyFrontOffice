import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListResponsesComponent } from './list-responses.component';

describe('ListResponsesComponent', () => {
  let component: ListResponsesComponent;
  let fixture: ComponentFixture<ListResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListResponsesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
