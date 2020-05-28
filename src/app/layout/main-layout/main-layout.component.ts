import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.sass']
})
export class MainLayoutComponent implements OnInit {

  isTrainmap = false;

  constructor(
    private router: Router
  ) {
    router.events.subscribe((val) => {
      this.isTrainmap = router.url.endsWith('train-map');
    });
  }

  ngOnInit(): void {
  }

}
