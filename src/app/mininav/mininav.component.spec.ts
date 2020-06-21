import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MininavComponent } from './mininav.component';

describe('MininavComponent', () => {
  let component: MininavComponent;
  let fixture: ComponentFixture<MininavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MininavComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MininavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
