import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public handleScroll: boolean = true;
  constructor() {}

  // Fired by cursor/resize updates
  $updateCursor: Subject<boolean> = new Subject();

  // Fired by NAV CLICK → tells main-body to scrollIntoView
  $scrollToSection: Subject<number> = new Subject();

  // Fired by SCROLL DETECTION → tells header to update the active nav highlight
  $updateSelectedSection: Subject<number> = new Subject();

  // Fired by right-box scroll → triggers section detection in main-body
  $checkScroll: Subject<void> = new Subject();
}
