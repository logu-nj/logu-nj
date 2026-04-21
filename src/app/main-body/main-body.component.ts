import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  HostListener,
} from '@angular/core';
import { CommonService } from '../shared/services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-body',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.scss'],
})
export class MainBodyComponent implements OnInit, AfterViewInit, OnDestroy {
  //Resume Button Variables
  @ViewChild('resButton') buttonRef!: ElementRef<HTMLButtonElement>;
  buttonObj!: HTMLButtonElement;
  left = 0;
  top = 0;

  //deactivateCheck
  deactivateCheck: boolean = false;

  //cursor subject
  cursorSubject!: Subscription;

  //section subject
  sectionSubject!: Subscription;

  // ── Carousel ────────────────────────────────────────────
  activeProjectIdx: number = 0;

  prevProject() {
    if (this.activeProjectIdx > 0) this.activeProjectIdx--;
  }

  nextProject() {
    if (this.activeProjectIdx < this.projectsList.length - 1) this.activeProjectIdx++;
  }

  goToProject(idx: number) {
    this.activeProjectIdx = idx;
  }

  //update section
  @ViewChildren('section')
  sectionList!: QueryList<ElementRef>;
  currentSection: number = 0;

  //Skills list
  skillsList = [
    {
      name: 'HTML',
      img: 'html.png',
    },
    {
      name: 'CSS',
      img: 'css.png',
    },
    {
      name: 'JS',
      img: 'js.png',
    },
    {
      name: 'Angular',
      img: 'angular.png',
    },
    {
      name: '.Net Core',
      img: 'dotnet.png',
    },
    {
      name: 'Python',
      img: 'python.png',
    },
    {
      name: 'FastAPI',
      img: 'fastapi.png',
    },
    {
      name: 'Flask',
      img: 'flask.png',
    },
    {
      name: 'SQL',
      img: 'sql.png',
    },
    {
      name: 'GitHub',
      img: 'github.png',
    },
    {
      name: 'Git',
      img: 'git.png',
    },
    {
      name: 'Docker',
      img: 'docker.png',
    },
    {
      name: 'AWS',
      img: 'aws.png',
    },
    {
      name: 'Huggingface',
      img: 'huggingface.svg',
    },
    {
      name: 'Ollama',
      img: 'ollama.png',
    },
    {
      name: 'LangChain',
      img: 'langchain.svg',
    },
    {
      name: 'LangGraph',
      img: 'langgraph.png',
    },
  ];

  //Projects list
  projectsList = [
    {
      name: 'ML Inspector Match',
      description:
        'Engineered high-performance computer vision capabilities by optimizing YOLO models and integrating real-time ML features like live segmentation into an Angular frontend via FastAPI. Improved model accuracy by 6% through data augmentation and hyperparameter tuning. Managed the complete ML pipeline, from deploying scalable AWS SageMaker training jobs using ECR and S3, to building robust .NET Web API microservices backed by PostgreSQL.',
      tech: 'Tech Stack: Angular, .NET Web API, Python, PGAdmin, AWS',
      year: 'Jun 2025 - Nov 2025',
      gitLink: 'https://github.com/',
      imgLink: 'ml.png',
    },
    {
      name: 'Telecaller',
      description:
        'Implemented asynchronous workers and queues to handle long-running tasks efficiently. Architected and implemented high-throughput asynchronous workers using Redis Stream/Kafka, managing 1,000+ messages per second for reliable message delivery. Utilized a Redis backplane to enable seamless cross-pod SignalR communication in a distributed environment. Integrated Amazon Chime to provide high-quality audio, video, and real-time screen-sharing capabilities.',
      tech: 'Tech Stack: Angular, .NET Web API, SSE, SignalR, PGAdmin, Chime, EventBridge and Lambda, S3, ElasticCache',
      year: 'Dec 2025 – Feb 2026',
      gitLink: 'https://github.com/',
      imgLink: 'telecaller.jpeg',
    },
    {
      name: 'HE Score',
      description:
        'Built as part of the Inspector Match Website to generate U.S. DOE Home Energy Scores. Implemented frontend validations in Angular for a seamless user experience. Designed .NET microservice architecture with gRPC integration to fetch home information. Converted inputs to HPXML format, processed via WSDL services, and generated compliant energy reports. Integrated a long-running, asynchronous worker for PDF generation, triggered via Kafka for reliable, high-throughput processing.',
      tech: 'Tech Stack: Angular, .NET Web API, Rest API, WSDL, GRPC, PGAdmin',
      year: 'Feb 2025 – Jun 2025',
      gitLink: 'https://github.com/',
      imgLink: 'hescore.png',
    },
    {
      name: 'DOB Alert',
      description:
        'Designed a robust SQL database and a custom Python algorithm to efficiently manage and proactively flag upcoming birthdays and recurring events. Integrated an automated Telegram Bot API to deliver timely reminders and personalized wishes to users. Leveraged PythonAnywhere for reliable task scheduling, ensuring 24/7 autonomous operation of the reminder system.',
      tech: 'Tech Stack: Python, SQL, Telegram BOT',
      year: 'Aug 2023 - Sep 2023',
      gitLink: 'https://github.com/',
      imgLink: 'dob.png',
    },
  ];

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    // console.log('on init');
    this.subscribeAllService();
  }

  ngAfterViewInit(): void {
    if (this.buttonRef) {
      this.buttonObj = this.buttonRef.nativeElement;
      setTimeout(() => {
        this.checkScrollSection();
        this.updateButtonPosition();
      }, 2000);
    }
  }

  ngOnDestroy(): void {
    this.unSubscribeAllService();
  }

  subscribeAllService() {
    this.cursorSubject = this.commonService.$updateCursor.subscribe(
      (val: boolean) => {
        // Only update button position on cursor/resize events
        this.updateButtonPosition();
      }
    );

    // Listen for NAV CLICK → scroll to that section
    this.sectionSubject = this.commonService.$scrollToSection.subscribe(
      (ind: number) => {
        this.currentSection = ind;
        this.gotoSection(ind);
      }
    );

    // Listen for right-box manual scroll (desktop) → update nav highlight
    this.commonService.$checkScroll.subscribe(() => {
      this.updateButtonPosition();
      // if (this.commonService.handleScroll) {
      this.checkScrollSection();
      // }
    });
  }

  scrollTimer: any;

  gotoSection(ind: number) {
    // Lock scroll detection while programmatic scroll is running
    this.commonService.handleScroll = false;

    this.sectionList
      ?.get(ind)
      ?.nativeElement.scrollIntoView({ behavior: 'smooth' });

    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }

    // Fallback: re-enable after 2500ms if scroll events stop firing
    this.scrollTimer = setTimeout(() => {
      this.commonService.handleScroll = true;
    }, 2500);
  }

  checkScrollSection() {
    // Use getBoundingClientRect() so it works for BOTH window scroll and right-box div scroll
    const viewportMid = window.innerHeight / 2;
    this.sectionList?.forEach((section: ElementRef, ind: number) => {
      const rect = section.nativeElement.getBoundingClientRect();
      // Section is "active" when its midpoint straddles the viewport center
      if (rect.top <= viewportMid && rect.bottom > viewportMid) {
        if (this.currentSection !== ind) {
          this.currentSection = ind;
          // Only update the nav highlight — do NOT trigger scroll
          this.commonService.$updateSelectedSection.next(ind);
        }
      }
    });
  }

  scrollTimerWindow: any;

  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.commonService.handleScroll) {
      this.checkScrollSection();
    } else {
      if (this.scrollTimerWindow) clearTimeout(this.scrollTimerWindow);
      this.scrollTimerWindow = setTimeout(() => {
        this.commonService.handleScroll = true;
      }, 400);
    }
  }

  unSubscribeAllService() {
    this.cursorSubject && this.cursorSubject.unsubscribe();
    this.sectionSubject && this.sectionSubject.unsubscribe();
  }

  updateButtonPosition = () => {
    if (this.buttonObj) {
      const rect = this.buttonObj.getBoundingClientRect();
      this.left = rect.left;
      this.top = rect.top;
    }
  };

  onMouseMove(event: MouseEvent) {
    if (this.buttonObj) {
      this.applyTransformEffect(event.clientX, event.clientY);
    }
  }

  applyTransformEffect(mouseX: number, mouseY: number) {
    if (!this.buttonObj) return;

    const radius = Math.max(
      this.buttonObj.offsetWidth * 0.75,
      this.buttonObj.offsetHeight * 0.75,
      100
    );
    const bx = this.left + this.buttonObj.offsetWidth / 2;
    const by = this.top + this.buttonObj.offsetHeight / 2;
    const dist = this.distanceBetween(mouseX, mouseY, bx, by) * 2;
    const angle = Math.atan2(mouseY - by, mouseX - bx);

    const ox = -1 * Math.cos(angle) * Math.max(radius - dist, 0);
    const oy = -1 * Math.sin(angle) * Math.max(radius - dist, 0);

    const rx = oy / 2;
    const ry = -ox / 2;

    this.buttonObj.style.transition = 'all 0.1s ease';
    this.buttonObj.style.transform = `translate(${ox}px, ${oy}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    this.buttonObj.style.boxShadow = `0px ${Math.abs(oy)}px ${(Math.abs(oy) / radius) * 40
      }px rgba(0,0,0,0.15)`;
  }

  distanceBetween(p1x: number, p1y: number, p2x: number, p2y: number): number {
    const dx = p1x - p2x;
    const dy = p1y - p2y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
