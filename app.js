import { PixelTracker } from "./PixelTracker.js";
import { PixelViewer } from "./PixelViewer.js";

class App {
  constructor() {
    this.renderVideo();
    // this.videoTracking();
  }

  async renderVideo() {
    const data = await fetch("./sample.json").then((res) => res.json());
    const viewer = new PixelViewer();
    viewer.setData(data);
  }

  videoTracking() {
    const video = document.createElement("video");
    video.src = "./sample.mp4";
    video.onloadedmetadata = () => {
      this.tracker = new PixelTracker();
      this.tracker.setVideo(video);
    };
  }
}

window.onload = () => {
  new App();
};
