const video   = document.querySelector('.player');
const canvas  = document.querySelector('.photo');
const context = canvas.getContext('2d');
const strip   = document.querySelector('.strip');
const snap    = document.querySelector('.snap');
const takePhotoBtn = document.querySelector('.takePhoto');

const greenScreen = (pixels) => {
    const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
};

const rgbSplit = (pixels) => {
    const pixelDataLength = pixels.data.length

    for(let i = 0; i < pixelDataLength; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0];
        pixels.data[i + 500] = pixels.data[i + 1];
        pixels.data[i - 550] = pixels.data[i + 2];
    }

    return pixels;
};

const redEffect = (pixels) => {
    const pixelDataLength = pixels.data.length

    for(let i = 0; i < pixelDataLength; i += 4) {
        pixels.data[i + 0] += 100;
        pixels.data[i + 1] -= 50;
        pixels.data[i + 2] *= 0.5;
    }

    return pixels;
};

const paintToCanvas = () => {
    const width   = video.videoWidth;
    const height  = video.videoHeight;
    canvas.width  = width;
    canvas.height = height;

    return setInterval(() => {
        context.drawImage(video, 0, 0, width, height);
        
        // take the pixels out
        let pixels = context.getImageData(0, 0, width, height);
        
        // mess with them with effects
        pixels     = redEffect(pixels);
        // pixels     = rgbSplit(pixels);
        // pixels     = greenScreen(pixels);
        
        // put them back
        context.putImageData(pixels, 0, 0); 
    }, (16));
    console.log(width, height);
}; 

const getVideo = () => {
    navigator.mediaDevices.getUserMedia({video:true, audio: false})
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(error => console.error(`You denied the webcam ;)`));
};

const takePhoto = () => { 
    // Playing pickture snap sound
    snap.currentTime = 0;
    snap.play();

    // take the dta out of canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    // link.textContent = 'Download Image';
    link.innerHTML = `<img src="${data}" alt="Picture of You">`;
    strip.insertBefore(link, strip.firstChild);
    console.log(data);
};

getVideo();
video.addEventListener('canplay', paintToCanvas);
takePhotoBtn.addEventListener('click', takePhoto);
