const { dir } = require('console');
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

function getDirs(path) {

    data = [{
        id: __dirname,
        parent: '',
        name: __dirname
    }];

    return new Promise((resolve, reject) => {

        fs.readdir(path, (err, files) => {

            for (const file of files) {

                data.push({
                    id: file,
                    parent: __dirname,
                    name: file,
                    value: fs.statSync(path + file).size
                });

                console.log(file);

            }
            
            resolve(data);
    
        });

    });

}

function getAllFilesAndDirs(currentPath, maxDepth = 2, recursionLevel = 0){

  let data = [];

  if(recursionLevel == 0){

    data = [{

      id: currentPath,
      parent: '',
      name: 'parent directory'
  
    }];

  }

  fs.readdirSync(currentPath).forEach((elementName) => {

    data.push({

      id: path.join(currentPath, elementName),
      parent: currentPath,
      name: elementName

    });

    try{

      if(fs.lstatSync(path.join(currentPath, elementName)).isDirectory() && maxDepth != 0){

          data = data.concat(getAllFilesAndDirs(path.join(currentPath, elementName), maxDepth - 1, recursionLevel + 1));

      }

    }

    catch(error){

      // console.log(error);

    }

  });

  return data;

}

// window:load event for Javascript to run after HTML
// because this Javascript is injected into the document head
window.addEventListener('load', () => {
    // let chartData = [{
    //     id: 'theworld',
    //     parent: '',
    //     name: 'The World',
    //   },
    //   {
    //     id: 'asia',
    //     parent: 'theworld',
    //     name: 'Asia',
    //     value: 4100000000
    //   },
    //   {
    //     id: 'africa',
    //     parent: 'theworld',
    //     name: 'Africa',
    //     value: 1260000000
    //   },
    //   {
    //     id: 'america',
    //     parent: 'theworld',
    //     name: 'America',
    //     value: 328000000
    //   },
    //   {
    //     id: 'europe',
    //     parent: 'theworld',
    //     name: 'Europe',
    //     value: 741000000
    //   },
    //   {
    //     id: 'ca',
    //     parent: 'america',
    //     name: 'California',
    //     value: 32000000
    //   },
    //   {
    //     id: 'ny',
    //     parent: 'america',
    //     name: 'New York',
    //     value: 19000000
    //   },
    //   {
    //     id: 'txt',
    //     parent: 'america',
    //     name: 'Texas',
    //     value: 29000000
    //   },
    // ];

    // let chartData = [];
    // let chartConfig = {};

    // getDirs('./', chartData).then((data) => {

    //     chartData = data;

    //     chartConfig = {
    //         type: 'tree',
    //         options: {
    //           link: {
    //             aspect: 'arc'
    //           },
    //           maxSize: 15,
    //           minSize: 5,
    //           node: {
    //             type: 'circle',
    //             tooltip: {
    //               padding: '8px 10px',
    //               borderRadius: '3px',
    //             }
    //           }
    //         },
    //         series: chartData
    //       };

    //     zingchart.render({
    //         id: 'myChart',
    //         data: chartConfig,
    //         height: '95%',
    //         width: '100%',
    //         output: 'canvas'
    //       });
    // });

  let chartData = getAllFilesAndDirs('../../../', 3);

  chartConfig = {
    type: 'tree',
    options: {
      link: {
        aspect: 'arc'
      },
      maxSize: 15,
      minSize: 5,
      node: {
        type: 'circle',
        tooltip: {
          padding: '8px 10px',
          borderRadius: '3px',
        }
      }
    },
    series: chartData
  };

  zingchart.render({
      id: 'myChart',
      data: chartConfig,
      height: '95%',
      width: '100%',
      output: 'canvas'
    });
   
    // change tree layout
    document.getElementById('tree-aspect').addEventListener('change', function(e) {
      chartConfig.options.aspect = e.srcElement.value;
      zingchart.exec('myChart', 'setdata', {
        data: chartConfig
      });
    });
   
    // change tree connector
    document.getElementById('tree-node').addEventListener('change', function(e) {
      chartConfig.options.link.aspect = e.srcElement.value;
      zingchart.exec('myChart', 'setdata', {
        data: chartConfig
      });
    });
   
    // change node type
    document.getElementById('tree-node-shape').addEventListener('change', function(e) {
      chartConfig.options.node.type = e.srcElement.value;
      zingchart.exec('myChart', 'setdata', {
        data: chartConfig
      });
    })
  });