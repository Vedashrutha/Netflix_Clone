import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseByLangComponent } from './browse-by-lang.component';

describe('BrowseByLangComponent', () => {
  let component: BrowseByLangComponent;
  let fixture: ComponentFixture<BrowseByLangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseByLangComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseByLangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
