import KMeans from "./KMeans";
import './styles/style.css';

const image = $('#image')[0];
let nClusters = 2;

showImage(image);

$('#nClusters').on('input change', function () {
  nClusters = $(this).val();
  $('#nClustersLabel').text('Количество кластеров: ' + nClusters);
});

$('#clustering').on('click', function () {
  kMeansClustering(nClusters);
});

function kMeansClustering(nClusters) {
  const imageCanvas = document.createElement('canvas');
  imageCanvas.width = image.width;
  imageCanvas.height = image.height;
  let imageContext = imageCanvas.getContext('2d');
  imageContext.drawImage(image, 0, 0);
  let imageData = imageContext.getImageData(0, 0, imageCanvas.width, imageCanvas.height);

  const pixels = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    pixels.push([imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]]);
  }

  $('#result').empty();
  KMeans.clustering(pixels, {k: nClusters}, (err, res) => {
    const clusters = res;

    for (let i = 0; i < clusters.length; i++) {
      const cls = clusters[i];
      const numberOfPixels = cls.cluster.length;
      const n = Math.floor(Math.sqrt(numberOfPixels));
      const m = Math.ceil(Math.sqrt(numberOfPixels));
      const clusterCanvas = document.createElement('canvas');
      clusterCanvas.width = n;
      clusterCanvas.height = m;
      let clusterContext = clusterCanvas.getContext("2d");
      let clusterImageData = clusterContext.createImageData(n, m);
      let data = clusterImageData.data;

      let pixelCounter = 0;
      for (let j = 0; j < data.length; j += 4) {
        if (pixelCounter < numberOfPixels) {
          data[j] = cls.cluster[pixelCounter][0];
          data[j + 1] = cls.cluster[pixelCounter][1];
          data[j + 2] = cls.cluster[pixelCounter][2];
          data[j + 3] = 255;
          pixelCounter++;
        } else {
          break;
        }
      }
      clusterContext.putImageData(clusterImageData, 0, 0);
      const result = document.createElement('img');
      result.src = clusterCanvas.toDataURL();
      $('#result').append(result);
    }
  });
}

function showImage(image) {
  const fr = new FileReader();
  fr.onload = function () {
    image.src = this.result;
  };
  $('#uploadFile').on('change', function () {
    fr.readAsDataURL($(this)[0].files[0]);
  });
}
