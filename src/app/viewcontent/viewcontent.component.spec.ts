import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcontentComponent } from './viewcontent.component';

describe('ViewcontentComponent', () => {
  let component: ViewcontentComponent;
  let fixture: ComponentFixture<ViewcontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewcontentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
