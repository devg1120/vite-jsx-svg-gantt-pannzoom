import {
  SVGGantt,
  CanvasGantt,
  StrGantt,
  utils
} from '/gantt/src';
import { getData, formatXML } from './utils';
import panzoom from "./panzoom/index.js";

const $ = s => document.querySelector(s);
const { tasks, links } = getData();

const data = utils.formatData(tasks, links);
const opts = {
  //viewMode: 'week',
  viewMode: 'day',
  onClick: v => console.log(v)
};

//var grid = document.getElementById("g-container");
document.documentElement.style.setProperty("--gridWidth", "200px");
document.documentElement.style.setProperty("--gridHeight", "60px");
//grid.style.setProperty("--gridWidth", 200);
//grid.style.setProperty("--gridHeight", 60);

//console.log(data);
// x-header
//const svgGantt1 = new SVGGantt('#svg1', 'svg1-ele','x-header',data, opts);
const svgGantt1 = new SVGGantt('#svg1', 'svg1-ele','all-area',data, opts);

// plot-area
//const svgGantt2 = new SVGGantt('#svg2', 'svg2-ele','plot-area', data, opts);
const svgGantt2 = new SVGGantt('#svg2', 'svg2-ele','all-area', data, opts);

// y-header
//const svgGantt3 = new SVGGantt('#svg3', 'svg3-ele','y-header', data, opts);
const svgGantt3 = new SVGGantt('#svg3', 'svg3-ele','all-area', data, opts);
const svgGantt4 = new SVGGantt('#svg4', 'svg4-ele','all-area', data, opts);
const svgGantt5 = new SVGGantt('#svg5', 'svg5-ele','all-area', data, opts);

// panzoom
var element1 = document.querySelector('#svg1-ele')
var element2 = document.querySelector('#svg2-ele')
var element3 = document.querySelector('#svg3-ele')
var element4 = document.querySelector('#svg4-ele')
var element5 = document.querySelector('#svg5-ele')

let topLeft = {x: 0, y: 0};
let topRight = {x: 1, y: 0};
let bottomLeft = {x: 0, y: 1};
let bottomRight = {x: 1, y: 1};
let centerCenter = {x: 0.5, y: 0.5};

var instance1 = panzoom(element1, {
  panMode: 'x',
  //bounds: true
  //boundsPadding: 0.1
  fixTopLeft: true,
  fixTopLeftPosition: {x:-140, y:0},
  transformOrigin: topLeft
});


var instance2 = panzoom(element2, {
  panMode: 'xy',
  fixTopLeft: true,
  fixTopLeftPosition: {x:-140, y:-60},
  transformOrigin: topLeft
});

var instance3 = panzoom(element3, {
  panMode: 'y',
  fixTopLeft: true,
  fixTopLeftPosition: {x:0, y:-60},
  transformOrigin: topLeft
});

var instance4 = panzoom(element4, {
  panMode: 'xy',
  fixTopLeft: true,
  fixTopLeftPosition: {x:-140, y:-60},
  transformOrigin: topLeft
});

var instance5 = panzoom(element5, {
  panMode: 'y',
  fixTopLeft: true,
  fixTopLeftPosition: {x:0, y:-60},
  transformOrigin: topLeft
});


instance1.on('pan', function(e) {
  var p = e.getPoint();
  instance2.syncMoveToX(p.x, p.y);
  instance4.syncMoveToX(p.x, p.y);
  //instance3.syncMoveTo(p.x, p.y);
});

instance2.on('pan', function(e) {
  var p = e.getPoint();
  instance1.syncMoveTo(p.x, p.y);
  instance3.syncMoveTo(p.x, p.y);
  instance4.syncMoveToX(p.x, p.y);
});

instance3.on('pan', function(e) {
  var p = e.getPoint();
  //instance1.syncMoveTo(p.x, p.y);
  instance2.syncMoveToY(p.x, p.y);
});

instance4.on('pan', function(e) {
  var p = e.getPoint();
  instance1.syncMoveTo(p.x, p.y);
  instance5.syncMoveTo(p.x, p.y);
  instance2.syncMoveToX(p.x, p.y);
});

instance5.on('pan', function(e) {
  var p = e.getPoint();
  //instance1.syncMoveTo(p.x, p.y);
  instance4.syncMoveToY(p.x, p.y);
});
/**********************************************/
/*
instance1.on('zoom', function(e) {
  var transform = e.getTransform();
  instance2.syncZoomTo(transform);
  instance3.syncZoomTo(transform);
});
*/
instance2.on('zoom', function(e) {
  var transform = e.getTransform();
  instance1.syncZoomTo(transform);
  instance3.syncZoomTo(transform);

	// https://www.webdesignleaves.com/pr/plugins/css-grid-masonry.html
	//
        var grid = document.getElementById("g-container");
	console.log(window.getComputedStyle(grid).getPropertyValue("grid-template-columns"));
	console.log(window.getComputedStyle(grid).getPropertyValue("grid-template-rows"));
        var x_header = document.getElementById("container-x-header");
	console.log(grid.style);
	console.log(x_header.style);
      //elem.style.border = "2px dotted #00bfa5";
      //elem.style.backgroundColor = "#c3ebff";
});
/*
instance3.on('zoom', function(e) {
  var transform = e.getTransform();
  instance1.syncZoomTo(transform);
  instance2.syncZoomTo(transform);
});
*/

//const canvasGantt = new CanvasGantt('#canvas', data, opts);
//const strGantt = new StrGantt(data, opts);

//function renderStr() {
//  $('#str').textContent = formatXML(strGantt.render());
//}
//
//renderStr();

function changeOptions(options) {
  svgGantt.setOptions(options);
  canvasGantt.setOptions(options);
  strGantt.setOptions(options);
  renderStr();
}

function changeData() {
  const list = utils.formatData(tasks, links);
  svgGantt.setData(list);
  canvasGantt.setData(list);
  strGantt.setData(list);
  renderStr();
}
$('#viewMode').onchange = e => {
  const viewMode = e.target.value;
  changeOptions({ viewMode });
};
$('#showLinks').onchange = () => {
  const showLinks = $('#showLinks').checked;
  changeOptions({ showLinks });
};
$('#showDelay').onchange = () => {
  const showDelay = $('#showDelay').checked;
  changeOptions({ showDelay });
};
$('#autoSchedule').onclick = () => {
  utils.autoSchedule(tasks, links);
  changeData();
};

function addLink(s, e) {
  const sid = parseInt(s.dataset['id']);
  const eid = parseInt(e.dataset['id']);
  const snode = tasks.find(t => t.id === sid);
  const enode = tasks.find(t => t.id === eid);
  let stype = isStart(s) ? 'S' : 'F';
  let etype = isStart(e) ? 'S' : 'F';
  if (snode.type === 'milestone') {
    stype = 'F';
  }
  if (enode.type === 'milestone') {
    etype = 'S';
  }
  links.push({ source: sid, target: eid, type: `${stype}${etype}` });
  changeData();
}

const NS = 'http://www.w3.org/2000/svg';

let $svg = null;
let moving = false;
let $start = null;
let $line = null;

function isStart(el) {
  return el.classList.contains('gantt-ctrl-start');
}

function isFinish(el) {
  return el.classList.contains('gantt-ctrl-finish');
}

document.onmousedown = (e) => {
  $svg = $('svg');
  if (!isStart(e.target) && !isFinish(e.target)) {
    return;
  }
  e.preventDefault();
  $start = e.target;
  document.querySelectorAll('.gantt-ctrl-start,.gantt-ctrl-finish').forEach(elem => {
    elem.style['display'] = 'block';
  });
  moving = true;
  $line = document.createElementNS(NS, 'line');
  const x = $start.getAttribute('cx');
  const y = $start.getAttribute('cy');
  $line.setAttribute('x1', x);
  $line.setAttribute('y1', y);
  $line.setAttribute('x2', x);
  $line.setAttribute('y2', y);
  $line.style['stroke'] = '#ffa011';
  $line.style['stroke-width'] = '2';
  $line.style['stroke-dasharray'] = '5';
  $svg.appendChild($line);
};

document.onmousemove = (e) => {
  if (!moving) return;
  e.preventDefault();
  if (isStart(e.target) || isFinish(e.target)) {
    const x = e.target.getAttribute('cx');
    const y = e.target.getAttribute('cy');
    $line.setAttribute('x2', x);
    $line.setAttribute('y2', y);
  } else {
    const x = e.clientX;
    const y = e.clientY;
    const rect = $svg.getBoundingClientRect();
    $line.setAttribute('x2', x - rect.left);
    $line.setAttribute('y2', y - rect.top);
  }
};

document.onmouseup = (e) => {
  if (!moving) return;
  e.preventDefault();
  const isCtrl = isStart(e.target) || isFinish(e.target);
  if ($start && isCtrl) {
    addLink($start, e.target);
  }

  document.querySelectorAll('.gantt-ctrl-start,.gantt-ctrl-finish').forEach(elem => {
    elem.style['display'] = 'none';
  });
  moving = false;
  if ($start) {
    $start.style['display'] = 'none';
    $start = null;
  }
  if ($line) {
    $svg.removeChild($line);
    $line = null;
  }
};
