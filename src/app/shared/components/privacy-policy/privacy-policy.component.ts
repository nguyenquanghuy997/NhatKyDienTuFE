import { Component } from '@angular/core';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
})
export class PrivacyPolicyComponent {
  selectedHeaderColor: string;
  constructor(
    private themeService: ThemeConstantService,
    private title: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.title.setTitle(this.route.snapshot.data.title);

    this.themeService.selectedHeaderColor.subscribe(
      (color) => (this.selectedHeaderColor = color)
    );
  }
}
