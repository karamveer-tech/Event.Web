import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserEventDetailsComponent } from './user-event-details.component';

describe('UserEventDetailsComponent', () => {
  let component: UserEventDetailsComponent;
  let fixture: ComponentFixture<UserEventDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UserEventDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
