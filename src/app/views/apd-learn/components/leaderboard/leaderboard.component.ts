import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LeaderBoardService, LeaderData, MyScoreData, TopicData } from 'src/app/services/leaderBoard.service';
import { MyConstants } from '@ejfdelgado/ejflab-common/src/MyConstants';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: [
    './leaderboard.component.css'
  ]
})
export class LeaderboardComponent implements OnInit {
  selectedTopic: TopicData | null = null;
  me: MyScoreData | null = null;
  others: LeaderData[] = [];
  svgRadarSvg: SafeHtml | null = null;
  topics: TopicData[] = [];

  constructor(
    public leaderBoardSrv: LeaderBoardService,
    private sanitizer: DomSanitizer,
  ) {
  }

  async ngOnInit() {
    this.me = await this.leaderBoardSrv.loadMyScore();
    this.topics = await this.leaderBoardSrv.loadLeaderTopics();

    const values = this.topics.map((topic) => {
      if (!this.me) {
        return 0;
      }
      return this.me.topics[topic.id];
    });

    this.svgRadarSvg = this.sanitizer.bypassSecurityTrustHtml(this.createRadarChart(values, {
      size: 400,
      strokeColor: "#0ec9f4",
      levels: 1,
      strokeWidth: 3,
      circleRadius: 23,
      topics: this.topics
    }));

    this.selectedTopic = this.topics[0];
    this.others = await this.leaderBoardSrv.loadLeaderBoard(this.selectedTopic.id);
    this.others.forEach((item, index) => {
      item.cache = {};
      if (index < 3) {
        item.cache['top'] = this.sanitizer.bypassSecurityTrustHtml(`<img style="width: 31px;top:3px;position: absolute;" src="${MyConstants.SRV_ROOT + "assets/img/leader" + (index + 1) + ".svg"}"/><spam>${index + 1}</spam>`);
      } else {
        item.cache['top'] = this.sanitizer.bypassSecurityTrustHtml(`<spam>${index + 1}</spam>`);
      }
      item.cache['avatarStyle'] = {
        "background-color": this.stringToColor(item.name),
        "color": "white",
      };
      item.cache['avatar'] = this.sanitizer.bypassSecurityTrustHtml(`<spam>${item.name.charAt(0).toLocaleUpperCase()}</spam>`);
    });
  }

  getMyStyleByTopic(topic: string): any {
    return {
      "width": `${this.getMyScoreByTopic(topic)}%`,
    }
  }

  getMyScoreByTopic(topic: string): number {
    if (!this.me) {
      return 0;
    }
    if (topic in this.me.topics) {
      return Math.round(100 * this.me.topics[topic]);
    }
    return 0;
  }

  selectTopic(topic: TopicData) {
    this.selectedTopic = topic;
  }

  getUserNumber(top: number, user: LeaderData) {
    if (!user.cache) {
      return "";
    }
    return user.cache['top'];
  }

  getUserAvatarStyle(top: number, user: LeaderData): { [key: string]: any; } {
    if (!user.cache) {
      return {};
    }
    return user.cache['avatarStyle'];
  }

  getAvatar(top: number, user: LeaderData) {
    if (!user.cache) {
      return "";
    }
    return user.cache['avatar'];
  }

  stringToColor(str: string) {
    let hash = 0;

    // Generate a hash from the string
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash to RGB
    let color = '#';
    for (let i = 0; i < 3; i++) {
      // Shift and mask to get RGB components
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).slice(-2);
    }

    return color;
  }

  createRadarChart(values: number[], options: any = {}) {
    const dimensions = values.length;
    const size = options.size || 300;
    const radius = (size / 2) * 0.8;
    const center = size / 2;
    const levels = options.levels || 5;
    const strokeColor = options.strokeColor || "#333";
    const strokeWidth = options.strokeWidth || 1;
    const fillColor = options.fillColor || "rgba(0, 150, 255, 0.5)";
    const imageUrls: TopicData[] = options.topics || [];

    const angleStep = (2 * Math.PI) / dimensions;

    const getPoint = (angle: number, value: number) => {
      const x = center + Math.cos(angle) * radius * value;
      const y = center - Math.sin(angle) * radius * value;
      return { x, y };
    };

    // Create grid
    let grid = '';
    for (let l = 1; l <= levels; l++) {
      const r = l / levels;
      let points = '';
      for (let i = 0; i < dimensions; i++) {
        const angle = i * angleStep;
        const { x, y } = getPoint(angle, r);
        points += `${x},${y} `;
      }
      grid += `<polygon points="${points.trim()}" fill="none" stroke="#EEE" stroke-width="${strokeWidth}"/>`;
    }

    // Create axes
    let axes = '';
    for (let i = 0; i < dimensions; i++) {
      const angle = i * angleStep;
      const { x, y } = getPoint(angle, 1);
      axes += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="#EEE" stroke-width="${strokeWidth}"/>`;
    }

    // Create data polygon
    let dataPoints = '';
    const pointsArray = [];
    for (let i = 0; i < dimensions; i++) {
      const angle = i * angleStep;
      const point = getPoint(angle, values[i]);
      const end = getPoint(angle, 1);
      dataPoints += `${point.x},${point.y} `;
      pointsArray.push(end);
    }
    const dataPolygon = `<polygon points="${dataPoints.trim()}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;

    // Add circles, images and value labels
    let visuals = '';
    const circleRadius = options.circleRadius || 20;

    pointsArray.forEach(({ x, y }, i) => {
      const imgId = `clip-img-${i}`;
      const valueLabel = (values[i] * 100).toFixed(0);
      visuals += `
        <clipPath id="${imgId}">
          <circle cx="${x}" cy="${y}" r="${circleRadius}" />
        </clipPath>
        <image 
          href="${imageUrls[i].image || ''}" 
          x="${x - circleRadius}" 
          y="${y - circleRadius}" 
          width="${circleRadius * 2}" 
          height="${circleRadius * 2}" 
          clip-path="url(#${imgId})"
        />
        <circle cx="${x}" cy="${y}" r="${circleRadius}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="none"/>
        <text x="${x}" y="${y - circleRadius - 5}" text-anchor="middle" font-size="20" fill="#333">${valueLabel}</text>
      `;
    });

    // Combine all into one SVG
    const svg = `
      <svg width="${size}" height="${size}" style="max-width: 100%;" viewBox="0 0 ${size} ${size}">
        <defs></defs>
        ${grid}
        ${axes}
        ${dataPolygon}
        ${visuals}
      </svg>
    `;

    return svg;
  }
}
