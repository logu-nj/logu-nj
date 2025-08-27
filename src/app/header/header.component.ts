import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { MainBodyComponent } from '../main-body/main-body.component';
import { CommonService } from '../shared/services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MainBodyComponent],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  //nav bar variable
  isNavOpen = true;
  isNavOpenDelay = this.isNavOpen;

  currentSection = 0;
  navTitles = [
    { name: 'ABOUT', icon: 'about.png' },
    { name: 'EDUCATION', icon: 'education.png' },
    { name: 'EXPERIENCE', icon: 'experience.png' },
    { name: 'SKILLS', icon: 'skills.png' },
    { name: 'PROJECTS', icon: 'projects.png' },
    { name: 'CONTACT', icon: 'contact.png' },
  ];

  //subject
  sectionSubject!: Subscription;

  constructor(public commonService: CommonService) { }
  ngOnInit(): void {
    this.subscribeAllService();
  }

  ngOnDestroy(): void {
    this.unSubscribeAllService();
  }
  subscribeAllService() {
    this.sectionSubject = this.commonService.$updateSelectedSection.subscribe(
      (val: number) => {
        if (val != this.currentSection) this.currentSection = val;
      }
    );
  }
  unSubscribeAllService() {
    this.sectionSubject && this.sectionSubject.unsubscribe();
  }
  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
    setTimeout(() => {
      this.commonService.$updateCursor.next(true);
      this.isNavOpenDelay = this.isNavOpen;
    }, 500);
  }

  updateScroll() {
    if (this.commonService.handleScroll) {
      this.commonService.$updateCursor.next(true);
    }
  }

  updateSection(index: number) {
    this.commonService.handleScroll = false;
    this.commonService.$updateSelectedSection.next(index);
  }
}
