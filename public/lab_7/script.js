/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
function getRandomIntInclusive(min, max) {
  const min1 = Math.ceil(min);
  const max1 = Math.floor(max);
  return Math.floor(Math.random() * (max1 - min1 + 1) + min1);
}
function range(int) {
  const arr = [];
  for (let i = 0; i < int; i += 1) {
    arr.push(i);
  }
  return arr;
}
// window.onload = convertRestaurantsToCategories;

async function convertRestaurantsToCategories(restaurantList) {
  const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  const json = await data.json();

  const arr = range(json.length);
  const randomRestaurants = arr.map((m) => {
    const which = getRandomIntInclusive(0, json.length);
    const restaurant = json[which];
    return restaurant;
  });

  // console.table(randomRestaurants);

  const div = document.createElement('div');
  div.innerHTML = `<h2>What we have</h2> <br> ${JSON.stringify(randomRestaurants[0])}<br /><br />`;
  $('body').append(div);

  // const newDataShape = randomRestaurants.reduce((collection, item) => {
  //   const findCat = collection.find((findItem) => findItem.label === item.category);

  //   if (!findCat) {
  //     collection.push({
  //       label: item.category,
  //       y: 1
  //     });
  //   } else {
  //     findCat.y += 1;
  //   }

  //   return collection;
  // }, {});
  const newDataShape = randomRestaurants.reduce((acc, obj) => {
    // console.log(obj.category)
    const key = obj.category;
    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key]++;
    return acc;
  }, {});
  // console.log('restauant categories', newDataShape);
  // console.log('number of categories', Object.keys(newDataShape).length);

  const list = [];
  Object.keys(newDataShape).forEach((key) => {
    list.push({ label: key, y: newDataShape[key] });
  });

  

  const div2 = document.createElement('div');
  const obj = {
    label: randomRestaurants[0].catagory,
    y: randomRestaurants.length
  };
  return list;
  // div2.innerHTML = `<h2>What we want</h2> <br /> <h4>A category, how many things are in the category</h4><pre><code class="language=javascript">${JSON.stringify(obj)}<br /><br />`;
  // $('body').append(div2);
  // console.log(newDataShape)
  // return newDataShape;
}

function makeYourOptionsObject(datapointsFromRestaurantsList) {
  CanvasJS.addColorSet('customColorSet1', ['#35EB87', '#F0DE1D', '#D95B25', '#AA1DF0', '#1CB1E6',
    '#EBB636', '#F08D1D', '#D95B25', '#F0B3AF', '#E61C8F']);
  // add an array of colors here https://canvasjs.com/docs/charts/chart-options/colorset/
  //

  const returnObj = {
    animationEnabled: true,
    colorSet: 'customColorSet1',
    title: {
      text: 'Places To Eat Out In Future'
    },
    axisX: {
      interval: 1,
      labelFontSize: 12
    },
    axisY2: {
      interlacedColor: 'rgba(1,77,101,.2)',
      gridColor: 'rgba(1,77,101,.1)',
      title: 'Restaurants By Category',
      labelFontSize: 12,
      scaleBreaks: {
        customBreaks: [{startvalue: 40, endvalue: 50, color: 'black', type: 'zigzag'},
          {startvalue: 85, endvalue: 100, color: 'black', type: 'zigzag'},
          {startvalue: 140, endvalue: 175, color: 'black', type: 'zigzag'}]
      } // Add your scale breaks here https://canvasjs.com/docs/charts/chart-options/axisy/scale-breaks/custom-breaks/
    },
    data: [{
      type: 'bar',
      name: 'restaurants',
      axisYType: 'secondary',
      color: '#014D65',
      dataPoints: [datapointsFromRestaurantsList]
    }]
  };
  return returnObj;
}

function runThisWithResultsFromServer(jsonFromServer) {
  console.log('jsonFromServer', jsonFromServer);
  sessionStorage.setItem('restaurantList', JSON.stringify(jsonFromServer)); // don't mess with this, we need it to provide unit testing support
  // Process your restaurants list
  // Make a configuration object for your chart
  // Instantiate your chart
  const reorganizedData = convertRestaurantsToCategories(jsonFromServer);
  
  const options = makeYourOptionsObject(reorganizedData);
  console.log(options);
  const chart = new CanvasJS.Chart('chartContainer', options);
  chart.render();
}

// Leave lines 52-67 alone; do your work in the functions above
document.body.addEventListener('submit', async (e) => {
  e.preventDefault(); // this stops whatever the browser wanted to do itself.
  const form = $(e.target).serializeArray();
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })
    .then((fromServer) => fromServer.json())
    .then((jsonFromServer) => runThisWithResultsFromServer(jsonFromServer))
    .catch((err) => {
      console.log(err);
    });
});