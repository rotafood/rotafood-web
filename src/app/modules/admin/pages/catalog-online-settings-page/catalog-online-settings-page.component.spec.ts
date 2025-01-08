import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogOnlineSettingsPageComponent } from './catalog-online-settings-page.component';

describe('CatalogOnlineSettingsPageComponent', () => {
  let component: CatalogOnlineSettingsPageComponent;
  let fixture: ComponentFixture<CatalogOnlineSettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogOnlineSettingsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatalogOnlineSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
