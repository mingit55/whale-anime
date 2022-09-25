import { PixelViewer } from "./PixelViewer.js";

export class PixelTracker {
  constructor() {
    this.removeList = [
      { x: 0, y: 0, width: 150, height: 50 },
      { x: 1000, y: 0, width: 150, height: 150 },
      { x: 0, y: 0, width: 1000, height: 5 },
    ];
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.video = null;
    this.sceans = [];
    this.imageData = [];

    this.canvas.addEventListener("click", () => {
      if (!this.video?.paused) return;
      if (!this.video) {
        alert("영상이 로드 되지 않았습니다.");
        return;
      }
      this.sceans = [];
      this.imageData = [];
      this.video.play();
      this.render();
    });
    document.body.append(this.canvas);
  }
  set width(value) {
    this.canvas.width = value;
  }
  set height(value) {
    this.canvas.height = value;
  }
  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
  get downloadData() {
    if (!this.video) return;

    return {
      width: this.width,
      height: this.height,
      sceans: this.sceans,
    };
  }

  setVideo(videoElement) {
    this.video = videoElement;
    this.width = videoElement.videoWidth;
    this.height = videoElement.videoHeight;
    // this.video.loop = true;
  }

  isRemoveArea(x, y) {
    return this.removeList.some(({ x: rx, y: ry, width: rw, height: rh }) => {
      return rx <= x && x <= rx + rw && ry <= y && y <= ry + rh;
    });
  }

  render() {
    if (this.video.paused) {
      this.tracker();
      // alert("영상이 종료되었습니다. 좌표가 파일로 다운로드 됩니다.");
      this.download();
      // this.preview();
      return;
    }

    // 영상을 그린다
    this.ctx.drawImage(this.video, 0, 0);

    // 지울 부분을 지운다
    this.removeList.forEach(({ x, y, width, height }) => {
      this.ctx.clearRect(x, y, width, height);
    });

    // 화면 전체를 스캔
    // 스캔해서 일정치가 넘으면 좌표를 기억한다
    const data = this.ctx.getImageData(0, 0, this.width, this.height).data;
    this.imageData.push(data);

    requestAnimationFrame(this.render.bind(this));
  }

  tracker() {
    this.imageData.forEach((data) => {
      const scean = [];
      const flagColor = [80, 80, 80, 128];
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          let i = (y * this.width + x) * 4;
          let color = [data[i], data[i + 1], data[i + 2], data[i + 3]];

          if (this.isRemoveArea(x, y)) {
            continue;
          }

          if (color.every((x, i) => x > flagColor[i])) {
            scean.push([x, y]);
          }
        }
      }
      if (scean.length > 0) {
        this.sceans.push(scean);
      }
    });
  }

  download() {
    let blob = new Blob([JSON.stringify(this.downloadData)], {
      type: "application/json",
    });
    let now = new Date();
    let a = document.createElement("a");
    a.download = `영상좌표(${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}).json`;
    a.href = URL.createObjectURL(blob);
    a.click();
  }

  preview() {
    let viewer = new PixelViewer();
    viewer.setData(this.downloadData);
  }
}
