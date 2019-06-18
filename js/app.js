'use strict';

// ------------------- Global Variables -------------------

var imageContainer = document.getElementById('image-container');
var img1 = document.getElementById('img1');
var img2 = document.getElementById('img2');
var img3 = document.getElementById('img3');
var desc1 = document.getElementById('desc1');
var desc2 = document.getElementById('desc2');
var desc3 = document.getElementById('desc3');
var resultsChartContainer = document.getElementById('results-chart');
var resultsSection = document.getElementById('hidden');
var resultsChart = null;

var totalClicks = 0;
var availableClicks = 25;

var currentImages = [];
// this variable is used on setCurrentAndPrevious(), not sure why it says it isn't...
var previousImages = null;


// ------------------- Constructor -------------------

var ProductImage = function(name, imgSrc, id){
  this.name = name;
  this.clicks = 0;
  this.timesShown = 0;
  this.src = imgSrc;
  this.id = id;
  this.color = pickRandomColor();
  ProductImage.allImages.push(this);
};
ProductImage.allImages = [];


// ------------------- Functions -------------------

var pickRandomColor = function(){
  var randomRgb = function(){
    var rand = Math.floor(Math.random()*255);
    return rand;
  };
  var randomA = function(){
    var rand = Math.random()*(1-0.2)+0.2;
    return rand;
  };
  return (`rgba(${randomRgb()}, ${randomRgb()}, ${randomRgb()}, ${randomA()})`);
};

var renderImages = function(firstIndex, secondIndex, thirdIndex){
  img1.src = ProductImage.allImages[firstIndex].src;
  img1.id = ProductImage.allImages[firstIndex].id;
  desc1.textContent = ProductImage.allImages[firstIndex].name;

  img2.src = ProductImage.allImages[secondIndex].src;
  img2.id = ProductImage.allImages[secondIndex].id;
  desc2.textContent = ProductImage.allImages[secondIndex].name;

  img3.src = ProductImage.allImages[thirdIndex].src;
  img3.id = ProductImage.allImages[thirdIndex].id;
  desc3.textContent = ProductImage.allImages[thirdIndex].name;
};

var setCurrentAndPrevious = function(firstIndex, secondIndex, thirdIndex){
  if (currentImages.length === 0){
    currentImages.push(ProductImage.allImages[firstIndex]);
    currentImages.push(ProductImage.allImages[secondIndex]);
    currentImages.push(ProductImage.allImages[thirdIndex]);
  } else {
    previousImages = currentImages;
    currentImages = [];
    currentImages.push(ProductImage.allImages[firstIndex]);
    currentImages.push(ProductImage.allImages[secondIndex]);
    currentImages.push(ProductImage.allImages[thirdIndex]);
  }
};

var incrementTimesShown = function(){
  for (var i = 0; i < currentImages.length; i++){
    currentImages[i].timesShown++;
  }
};

var checkIfOnPage = function(numToCheck){
  var isOnPage = false;
  for (var i = 0; i < currentImages.length; i++){
    if (ProductImage.allImages[numToCheck] === currentImages[i]){
      isOnPage = true;
    }
  }
  return isOnPage;
};


var generateImages = function(){
  do {
    var firstIndex = Math.floor(Math.random() * ProductImage.allImages.length);
  } while (checkIfOnPage(firstIndex));

  do {
    var secondIndex = Math.floor(Math.random() * ProductImage.allImages.length);
  } while (secondIndex === firstIndex || checkIfOnPage(secondIndex));

  do {
    var thirdIndex = Math.floor(Math.random() * ProductImage.allImages.length);
  } while (thirdIndex === firstIndex || thirdIndex === secondIndex || checkIfOnPage(thirdIndex));

  renderImages(firstIndex, secondIndex, thirdIndex);
  setCurrentAndPrevious(firstIndex, secondIndex, thirdIndex);
  incrementTimesShown();
};

var handleImageClick = function(event){
  var target = event.target;
  var imgId = target.id;

  totalClicks++;

  for (var i = 0; i < currentImages.length; i++){
    if (imgId === currentImages[i].id) {
      currentImages[i].clicks++;
      generateImages();
    }
  }

  if (totalClicks === availableClicks) {
    chartForResults();
    resultsSection.id = '';

  } else if (totalClicks > availableClicks) {
    for (i = 0; i < ProductImage.allImages.length; i++){
      if (imgId === ProductImage.allImages[i].id){
        resultsChart.data.datasets[0].data[i] = Math.round((ProductImage.allImages[i].clicks / ProductImage.allImages[i].timesShown) * 100);
        resultsChart.update();
      }
    }
  }
};

// make the chart
var chartForResults = function(){
  var percentages = [];
  var labels = [];
  var colors = [];

  for (var i = 0; i < ProductImage.allImages.length; i++){
    var percent = Math.round((ProductImage.allImages[i].clicks / ProductImage.allImages[i].timesShown) * 100);

    // add to the object instance instead?
    percentages.push(percent);
    labels.push(ProductImage.allImages[i].name);
    colors.push(ProductImage.allImages[i].color);
  }

  var chartData = {
    labels: labels,
    datasets: [{
      label: '',
      data: percentages,
      backgroundColor: colors,
      borderColor: colors,
      borderWidth: 1
    }]
  };

  var chartObject = {
    type: 'bar',
    data: chartData,
    options: {
      title: {
        display: true,
        text: '% of positive votes per times shown'
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  };

  // chart is defined in the chart.js library
  resultsChart = new Chart(resultsChartContainer, chartObject);
};


// ------------------- Add all images -------------------
var populateImages = function(){
  new ProductImage('R2-D2 Bag', '../img/bag.png', 'bag');
  new ProductImage('Banana Slicer', '../img/banana.jpg', 'banana');
  new ProductImage('Bathroom Tablet Holder', '../img/bathroom.jpg', 'bathroom');
  new ProductImage('Peekaboo Toe Rain Boots', '../img/boots.jpg', 'boots');
  new ProductImage('All-In-One Breakfast Maker', '../img/breakfast.png', 'breakfast');
  new ProductImage('Meatball Bubblegum', '../img/bubblegum.jpg', 'bubblegum');
  new ProductImage('Rounded Chair', '../img/chair.png', 'chair');
  new ProductImage('Cthulhu Figurine', '../img/cthulhu.jpg', 'cthulhu');
  new ProductImage('Doggie Duck Bill', '../img/dog-duck.png', 'dog-duck');
  new ProductImage('Dragon Meat', '../img/dragon.png', 'dragon');
  new ProductImage('Pen Silverware', '../img/pen.png', 'pen');
  new ProductImage('Pet Sweep Dust Boots', '../img/pet-sweep.png', 'pet-sweep');
  new ProductImage('Pizza Scissors', '../img/scissors.png', 'scissors');
  new ProductImage('Shark Sleeping Bag', '../img/shark.png', 'shark');
  new ProductImage('Baby Sweeper Onesie', '../img/sweep.png', 'sweep');
  new ProductImage('Tauntaun Sleeping Bag', '../img/tauntaun.png', 'tauntaun');
  new ProductImage('Unicorn Meat', '../img/unicorn.png', 'unicorn');
  new ProductImage('Tentacle USB', '../img/usb.gif', 'usb');
  new ProductImage('Self-Watering Can', '../img/water-can.jpg', 'water-can');
  new ProductImage('Peep-Hole Wine Glass', '../img/wine-glass.png', 'wine-glass');
};


var renderPage = function(){
  imageContainer.addEventListener('click', handleImageClick);
  populateImages();
  generateImages();
};

renderPage();





