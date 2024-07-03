$(function() {

  $(document).on("click", function(e) {
    var $item = $(".rad-dropmenu-item");
    if ($item.hasClass("active")) {
      $item.removeClass("active");
    }
  });

  $(".rad-toggle-btn").on('click', function() {
    $(".rad-sidebar").toggleClass("rad-nav-min");
    $(".rad-body-wrapper").toggleClass("rad-nav-min");
    setTimeout(function() {
      initializeCharts();
    }, 200);
  });

  $(".rad-dropdown >.rad-menu-item").on('click', function(e) {
    e.stopPropagation();
    $(".rad-dropmenu-item").removeClass("active");
    $(this).next(".rad-dropmenu-item").toggleClass("active");
  });
  /*
  $(window).resize(function() {
    $.throttle(250, setTimeout(function() {
      initializeCharts();
    }, 200));
  });
  */
  var colors = [
    '#E94B3B',
    '#39C7AA',
    '#1C7EBB',
    '#F98E33'
  ];
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  var panelList = $('.col-lg-4 col-md-6 col-xs-12');

  panelList.sortable({
    handle: '.col-lg-4 col-md-6 col-xs-12',
    update: function() {
      $('.panel', panelList).each(function(index, elem) {
        var $listItem = $(elem),
          newIndex = $listItem.index();
      });
    }
  });

  function initializeCharts() {

    $(".rad-chart").empty();
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    var trace1 = {
      x: [0, 1, 2, 3, 4, 5], 
      y: [1.5, 1, 1.3, 0.7, 0.8, 0.9], 
      type: 'scatter'
    };  
    var trace2 = {
      x: [0, 1, 2, 3, 4, 5], 
      y: [1, 0.5, 0.7, -1.2, 0.3, 0.4], 
      type: 'bar'
    };
    
    var data = [trace1, trace2]; //Get this list from the object.keys() to input the function of the key list data 
    
    Plotly.newPlot('MotionSensor', data, {}, {showSendToCloud: true});
  
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //Chemical sensor
    var myPlot = document.getElementById('ChemicalChart'),
        d3 = Plotly.d3,
        N = 100,
        x = d3.range(N),
        y1 = d3.range(N).map( d3.random.normal() ),
        y2 = d3.range(N).map( d3.random.normal(-2) ),
        y3 = d3.range(N).map( d3.random.normal(2) ),
        trace1 = { x:x, y:y1, type:'scatter', mode:'lines', name:'PH' },
        trace2 = { x:x, y:y2, type:'scatter', mode:'lines', name:'Temperature' },
        trace3 = { x:x, y:y3, type:'scatter', mode:'lines', name:'Nitrogen' },
        data = [ trace1, trace2, trace3 ],
        layout = {
            hovermode:'closest',
            title:'Chemical fusion sensors'
         };

    Plotly.newPlot('ChemicalChart', data, layout, {showSendToCloud: true});

    myPlot.on('plotly_click', function(data){
        var pts = '';
        for(var i=0; i<data.points.length; i++){
            annotate_text = 'x = '+data.points[i].x +
                          'y = '+data.points[i].y.toPrecision(4);

            annotation = {
              text: annotate_text,
              x: data.points[i].x,
              y: parseFloat(data.points[i].y.toPrecision(4))
            }

            annotations = self.layout.annotations || [];
            annotations.push(annotation);
            Plotly.relayout('ChemicalChart',{annotations: annotations})
        }
    });
  
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..
    //Environment sensor
    var trace1 = {
      x: [1, 2, 3, 4],
      y: [0, 2, 3, 5],
      fill: 'tozeroy',
      type: 'scatter'
    };
    var trace2 = {
      x: [1, 2, 3, 4],
      y: [3, 5, 1, 7],
      fill: 'tonexty',
      type: 'scatter'
    };
    var data = [trace1, trace2];
    
    Plotly.newPlot('EnvironmentSensor', data, {}, {showSendToCloud:true}); 

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Biometric sensor data 
    var data_polar = [
      {
        type: "scatterpolar",
        mode: "lines+markers",
        r: [1,2,3,4,5],
        theta: [0,90,180,360,0],
        line: {
          color: "#ff66ab"
        },
        marker: {
          color: "#8090c7",
          symbol: "square",
          size: 8
        },
        subplot: "polar"
      },
      {
        type: "scatterpolar",
        mode: "lines+markers",
        r: [1,2,3,4,5],
        theta: [0,90,180,360,0],
        line: {
          color: "#ff66ab"
        },
        marker: {
          color: "#8090c7",
          symbol: "square",
          size: 8
        },
        subplot: "polar2"
      }
    ]
  
  var layout_polar = {
      showlegend: false,
      polar: {
        domain: {
          x: [0,0.4],
          y: [0,1]
        },
        radialaxis: {
          tickfont: {
            size: 8
          }
        },
        angularaxis: {
          tickfont: {
            size: 8
          },
          rotation: 90,
          direction: "counterclockwise"
        }
      },
      polar2: {
        domain: {
          x: [0.6,1],
          y: [0,1]
        },
        radialaxis: {
          tickfont: {
            size: 8
          }
        },
        angularaxis: {
          tickfont: {
            size: 8
          },
          direction: "clockwise"
        }
      }
    }
  
  Plotly.newPlot('PolarChart', data_polar, layout_polar)
  
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Sound sensor
d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/polar_dataset.csv', function(err, rows){
      function unpack(rows, key) {
          return rows.map(function(row) { return row[key]; });
      }

var trace1 = {
  r: unpack(rows, 'x1'),
  theta: unpack(rows, 'y'),
  mode: 'lines',
  name: 'Figure8',
  line: {color: 'peru'},
  type: 'scatterpolar'
};

var trace2 = {
  r: unpack(rows, 'x2'),
  theta: unpack(rows, 'y'),
  mode: 'lines',
  name: 'Cardioid',
  line: {color: 'darkviolet'},
  type: 'scatterpolar'
};

var trace3 = {
  r: unpack(rows, 'x3'),
  theta: unpack(rows, 'y'),
  mode: 'lines',
  name: 'Hypercardioid',
  line: {color: 'deepskyblue'},
  type: 'scatterpolar'
};

var trace4 = {

  r: unpack(rows, 'x4'),
  theta: unpack(rows, 'y'),
  mode: 'lines',
  name: 'Subcardioid',
  line: {color: 'orangered'},
  type: 'scatterpolar'
};

var trace5 = {

  r: unpack(rows, 'x5'),
  theta: unpack(rows, 'y'),
  mode: 'lines',
  name: 'Supercardioid',
  marker: {
    color: 'none',
    line: {color: 'green'}
  },
  type: 'scatterpolar'
};

var data_sound = [trace1, trace2, trace3, trace4, trace5];

var layout_sound = {
  title: 'Mic Patterns',
  font: {
    family: 'Arial, sans-serif;',
    size: 12,
    color: '#000'
  },
  showlegend: true,
  orientation: -90
};
Plotly.newPlot('SoundSensor', data_sound, layout_sound);
});
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
/*
var tracer1 = {
  type: "carpet",
  a: [0.1, 0.2, 0.3],
  b: [1, 2, 3],
  y: [
    [1, 2.2, 3],
    [1.5, 2.7, 3.5],
    [1.7, 2.9, 3.7]
  ],
  cheaterslope: 1,
  aaxis: {
    title: "a",
    tickmode: "linear",
    dtick: 0.05,
    minorgridcount: 9
  },
  baxis: {
    title: "b",
    tickmode: "linear",
    dtick: 0.5,
    minorgridcount: 9
  }
}

var tracer2 = {
type: "scattercarpet",
name: "b = 1.5",
a: [0.05, 0.15, 0.25, 0.35],
b: [1.5, 1.5, 1.5, 1.5]
}

var tracer3 = {
type: "scattercarpet",
name: "b = 2",
a: [0.05, 0.15, 0.25, 0.35],
b: [2, 2, 2, 2]
}

var tracer4 = {
type: "scattercarpet",
name: "b = 2.5",
a: [0.05, 0.15, 0.25, 0.35],
b: [2.5, 2.5, 2.5, 2.5]
}

var tracer5 = {
type: "scattercarpet",
name: "a = 0.15",
a: [0.15, 0.15, 0.15, 0.15],
b: [0.5, 1.5, 2.5, 3.5],
line: {
    smoothing: 1,
    shape: "spline"
}
}

var tracer6 = {
type: "scattercarpet",
name: "a = 0.2",
a: [0.2, 0.2, 0.2, 0.2],
b: [0.5, 1.5, 2.5, 3.5],
line: {
    smoothing: 1,
    shape: "spline"
},
marker: {
    size: [10, 20, 30, 40],
    color: ["#000", "#f00", "#ff0", "#fff"]
}
}

var tracer7 = {
type: "scattercarpet",
name: "a = 0.25",
a: [0.25, 0.25, 0.25, 0.25],
b: [0.5, 1.5, 2.5, 3.5],
line: {
    smoothing: 1,
    shape: "spline"
}
}

var data_touch = [tracer1,tracer2,tracer3,tracer4,tracer5,tracer6,tracer7]

var layout_touch = {
title: "scattercarpet extrapolation, clipping, and smoothing",
hovermode: "closest"
}

Plotly.newPlot('TouchSensor', data_touch, layout_touch)
*/
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Get 3D surface sensor graph data 
z1 = [
  [8.83,8.89,8.81,8.87,8.9,8.87],
  [8.89,8.94,8.85,8.94,8.96,8.92],
  [8.84,8.9,8.82,8.92,8.93,8.91],
  [8.79,8.85,8.79,8.9,8.94,8.92],
  [8.79,8.88,8.81,8.9,8.95,8.92],
  [8.8,8.82,8.78,8.91,8.94,8.92],
  [8.75,8.78,8.77,8.91,8.95,8.92],
  [8.8,8.8,8.77,8.91,8.95,8.94],
  [8.74,8.81,8.76,8.93,8.98,8.99],
  [8.89,8.99,8.92,9.1,9.13,9.11],
  [8.97,8.97,8.91,9.09,9.11,9.11],
  [9.04,9.08,9.05,9.25,9.28,9.27],
  [9,9.01,9,9.2,9.23,9.2],
  [8.99,8.99,8.98,9.18,9.2,9.19],
  [8.93,8.97,8.97,9.18,9.2,9.18]
];

z2 = [];
for (var i=0;i<z1.length;i++ ) { 
z2_row = [];
  for(var j=0;j<z1[i].length;j++) { 
    z2_row.push(z1[i][j]+1);
  }
  z2.push(z2_row);
}

z3 = []
for (var i=0;i<z1.length;i++ ) { 
z3_row = [];
  for(var j=0;j<z1[i].length;j++) { 
    z3_row.push(z1[i][j]-1);
  }
  z3.push(z3_row);
}
var data_z1 = {z: z1, type: 'surface'};
var data_z2 = {z: z2, showscale: false, opacity:0.9, type: 'surface'};
var data_z3 = {z: z3, showscale: false, opacity:0.9, type: 'surface'};



Plotly.newPlot('TouchSensor', [data_z1]);
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Position sensor 
var pointCount = 31;
var i, r;

var x = [];
var y = [];
var z = [];
var c = [];

for(i = 0; i < pointCount; i++) 
{
   r = 10 * Math.cos(i / 10);
   x.push(r * Math.cos(i));
   y.push(r * Math.sin(i));
   z.push(i);
   c.push(i)
}

Plotly.newPlot('Possensor', [{
  type: 'scatter3d',
  mode: 'lines+markers',
  x: x,
  y: y,
  z: z,
  line: {
    width: 6,
    color: c,
    colorscale: "Viridis"},
  marker: {
    size: 3.5,
    color: c,
    colorscale: "Greens",
    cmin: -20,
    cmax: 50
  }},                  
]);
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

}

  initializeCharts();
});