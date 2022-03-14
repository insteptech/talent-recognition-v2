export class Webcam {
  webcamElement: any;
  canvasElement: any;
  constructor(webcamElement: any, canvasElement: any) {
    this.webcamElement = webcamElement;
    this.canvasElement = canvasElement;
  }

  adjustVideoSize(width: number, height: number) {
    const aspectRatio = width / height;
    if (width >= height) {
      this.webcamElement.width = aspectRatio * this.webcamElement.height;
    } else if (width < height) {
      this.webcamElement.height = this.webcamElement.width / aspectRatio;
    }
  }

  async setup() {
    return new Promise<void>((resolve, reject) => {
      try {
        if (navigator.mediaDevices.getUserMedia !== undefined) {
          navigator.mediaDevices
            .getUserMedia({ audio: false, video: { facingMode: "user" } })
            .then(mediaStream => {
              if ("srcObject" in this.webcamElement) {
                this.webcamElement.srcObject = mediaStream;
              } else {
                // For older browsers withouth the srcObject.
                this.webcamElement.src = window.URL.createObjectURL(mediaStream);
              }
              this.webcamElement.addEventListener(
                "loadeddata",
                async () => {
                  this.adjustVideoSize(
                    this.webcamElement.videoWidth,
                    this.webcamElement.videoHeight
                  );
                  return resolve();
                },
                false
              );
            }).catch(err => {
              return reject();
            });
        } else {
          return reject();
        }
      } catch (ex) {
        return reject();
      }
    });
  }
  stop() {
    const stream = this.webcamElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function (track: { stop: () => void; }) {
      track.stop();
    });
    this.webcamElement.srcObject = null;
  }
  _drawImage() {
    const imageWidth = this.webcamElement.videoWidth;
    const imageHeight = this.webcamElement.videoHeight;

    const context = this.canvasElement.getContext("2d");
    this.canvasElement.width = imageWidth;
    this.canvasElement.height = imageHeight;

    context.drawImage(this.webcamElement, 0, 0, imageWidth, imageHeight);

    return { imageHeight, imageWidth };
  }

  takeBlobPhoto() {
    const { imageWidth, imageHeight } = this._drawImage();
    return new Promise((resolve, reject) => {
      this.canvasElement.toBlob((blob: any) => {
        resolve({ blob, imageHeight, imageWidth });
      });
    });
  }

  takeBase64Photo({ type, quality } = { type: "png", quality: 1 }) {
    const { imageHeight, imageWidth } = this._drawImage();
    const base64 = this.canvasElement.toDataURL("image/" + type, quality);
    return { base64, imageHeight, imageWidth };
  }
}
