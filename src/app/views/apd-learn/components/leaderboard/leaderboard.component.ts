import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LeaderBoardService, LeaderData, TopicData } from 'src/app/services/leaderBoard.service';



@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: [
    './leaderboard.component.css'
  ]
})
export class LeaderboardComponent implements OnInit {
  me: LeaderData | null = null;
  others: LeaderData[] = [];
  svgRadarSvg: SafeHtml | null = null;
  topics: TopicData[] = [];

  constructor(
    public leaderBoardSrv: LeaderBoardService,
    private sanitizer: DomSanitizer,
  ) {

  }

  createRadarChart(values: number[], options: any = {}) {
    const dimensions = values.length;
    const size = options.size || 300;
    const radius = (size / 2) * 0.8;
    const center = size / 2;
    const levels = options.levels || 5; // grid lines
    const strokeWidth = options.strokeWidth || 1;
    const strokeColor = options.strokeColor || "#333";
    const fillColor = options.fillColor || "rgba(0, 150, 255, 0.5)";

    const angleStep = (2 * Math.PI) / dimensions;

    // Function to get point on circle
    const getPoint = (angle: number, value: number) => {
      const x = center + Math.cos(angle) * radius * value;
      const y = center - Math.sin(angle) * radius * value;
      return `${x},${y}`;
    };

    // Create level lines (grid)
    let grid = '';
    for (let l = 1; l <= levels; l++) {
      const r = l / levels;
      let points = '';
      for (let i = 0; i < dimensions; i++) {
        const angle = i * angleStep;
        points += getPoint(angle, r) + ' ';
      }
      grid += `<polygon points="${points.trim()}" fill="none" stroke="#ccc" stroke-width="0.5"/>`;
    }

    // Create axis lines
    let axes = '';
    for (let i = 0; i < dimensions; i++) {
      const angle = i * angleStep;
      const x = center + Math.cos(angle) * radius;
      const y = center - Math.sin(angle) * radius;
      axes += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="#999" stroke-width="0.5"/>`;
    }

    // Create data polygon
    let dataPoints = '';
    for (let i = 0; i < dimensions; i++) {
      const angle = i * angleStep;
      dataPoints += getPoint(angle, values[i]) + ' ';
    }
    const dataPolygon = `<polygon points="${dataPoints.trim()}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;

    // Combine SVG
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        ${grid}
        ${axes}
        ${dataPolygon}
      </svg>
    `;

    return svg;
  }

  async ngOnInit() {
    this.topics = await this.leaderBoardSrv.loadLeaderTopics();
    this.others = await this.leaderBoardSrv.loadLeaderBoard("");
    this.svgRadarSvg = this.sanitizer.bypassSecurityTrustHtml(this.createRadarChart([0.1, 0.5, 1], {
      levels: 1,
      strokeWidth: 3,
    }));
  }
}
