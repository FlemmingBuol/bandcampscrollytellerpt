var main = d3.select(".main");
var scrolly = main.select(".scroll");
var figure = scrolly.select(".scroll_graphic");
var article = scrolly.select(".scroll_text");
var step = article.selectAll(".step");


// Make a list of all the images shown during the scrolling
const images = [...document.querySelectorAll(".step")].map(d => d.getAttribute("data-img"))

// initialize the scrollama
var scroller = scrollama();
var scroller2 = scrollama();


function handleStepEnter(response) {
	// update graphic based on stepf
	figure.select("img").attr("src", images[response.index])

	// Little message
	console.log("Step", response.index, "entered the stage. The direction is", response.direction)
}

function handleStepExit(response) {
	// Little message
	console.log("Step", response.index, "exited the stage. The direction is", response.direction)
}


// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var figureHeight = window.innerHeight / 0.8;
	var figureMarginTop = (window.innerHeight - figureHeight) / 0.8;

	figure
		.style("height", figureHeight + "px")
		.style("top", figureMarginTop + "px");

	// 2. tell scrollama to update new element dimensions
	scroller.resize();
}

function init() {
	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();

	// 2. setup the scroller passing options
	// 		this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller
		.setup({
			step: ".scroll_text .step",
			offset: 1,
			debug: false
		})
		.onStepEnter(handleStepEnter)
		.onStepExit(handleStepExit)


}
// switchfunc() ist die Funktion für den Togglebutton
async function switchfunc() {
	var checkBox = document.getElementById("derSchalter");

	if (checkBox.checked == true) {

		document.querySelectorAll('#world').forEach(el => {
			el.style.display = "none";
		})
		document.querySelectorAll('#ch').forEach(el => {
			el.style.display = "block";
		})
	} else {

		document.querySelectorAll('#ch').forEach(el => {
			el.style.display = "none";
		})
		document.querySelectorAll('#world').forEach(el => {
			el.style.display = "block";
		})
	}
}

function testarrayfunc() {
	//also hier Laden wir die beiden Datensätze csv

	var array1 = [{
		x: 50,
		y: 50,
		r: 10
	},
	{
		x: 100,
		y: 50,
		r: 20
	}]
	var array2 = [{
		x: 100,
		y: 50,
		r: 10
	},
	{
		x: 200,
		y: 100,
		r: 10
	}, {
		x: 300,
		y: 200,
		r: 30
	}]
	//hier wird zwischen den Datensätzen hin und her geswitcht
	var checkBox = document.getElementById("derSchalter");
	var data = array1
	if (checkBox.checked == true) {
		data = array2
	} else {
		data = array1
	}

	//console.log(data)
	// von hier holen wir uns das svg mit der richtigen Id
	var svg = d3.select("#testid");
	// Daten werden in ein Svg Element geladen
	var circle = svg.selectAll("circle")
		.data(data);
	// Alte Daten werden raussgezogen
	circle.exit().remove();


	// Hier werden die nötigen Elemente gezeichnet
	circle.join("circle")
		.transition()
		.duration(200)
		.attr("cx", function (d) {
			return d.x;
		})
		.attr("cy", function (d) {
			return d.y;
		})
		.attr("r", function (d) {
			return d.r;
		})




}
// top20Tags ist die Visualisierung für die Bubblechart
async function top20tags() {
	//Laden und Aktivierung
	var checkBox = document.getElementById("derSchalter");
	var colScale = d3.scaleOrdinal(["#ff4040", "#f8671f", "#e49109", "#c5b900", "#9fdb05", "#75f317", "#4cfe34", "#29fc59", "#0fec83", "#02d1ac", "#02acd1", "#0f83ec", "#2959fc", "#4c34fe", "#7517f3", "#9f05db", "#c500b9", "#e40991", "#f81f67", "#ff4040"])
	var array1 = await d3.csv("csv/top20tagsw.csv", function (data) {
		return {
			tags: data.Tags,
			anzahl: +data.Anzahl
		}
	})

	var array2 = await d3.csv("csv/top20tagsch.csv", function (data) {
		return {
			tags: data.Tags,
			anzahl: +data.Anzahl
		}
	})
	if (checkBox.checked == true) {
		data = array2
	} else {
		data = array1
	}
	// Zeichen

	var rscale = d3.scaleLinear()
		.domain(d3.extent(data, d => (Math.sqrt(d.anzahl)) / (2 * Math.PI)))
		.range([0, 100]);

	var svg = d3.select("#Top20tagscanvas");
	var circles = svg.selectAll("circle")
		.data(data)
	//circles.exit().remove()

	circles.join("circle").transition()
		.duration(1000)
		.style("fill", function (d) {
			return colScale(d.tags)
		})
		.attr("r", function (d) {
			return rscale((Math.sqrt(d.anzahl)) / (2 * Math.PI))
		})


	var simulation = d3.forceSimulation(circles)
		.force("center", d3.forceCenter().x(145).y(500 / 2)) // Attraction to the center of the svg area
		.force("charge", d3.forceManyBody().strength(.5)) // Nodes are attracted one each other of value is > 0
		.force("collide", d3.forceCollide().strength(.2).radius(function (d) {
			return rscale((Math.sqrt(d.anzahl)) / (2 * Math.PI))
		}).iterations(1)) // Force that avoids circle overlapping

	simulation
		.nodes(data)
		.on("tick", function (d) {
			circles

				.attr("cx", function (d) { return d.x; })
				.attr("cy", function (d) { return d.y; })
		});

}

async function top20tagsalt() {
	var data;
	var mapdomain;
	var checkBox = document.getElementById("derSchalter");
	var svg = d3.select("#Top20tagscanvas");
	var colScale = d3.scaleOrdinal(d3.schemeCategory10)

	if (checkBox.checked == true) {
		data = await d3.csv("csv/top20tagsch.csv", function (data) {
			return {
				tags: data.Tags,
				anzahl: +data.Anzahl
			}
		})
	} else {
		data = await d3.csv("csv/top20tagsw.csv", function (data) {
			return {
				tags: data.Tags,
				anzahl: +data.Anzahl
			}
		})
	}
	console.log(data)
	var rscale = d3.scaleLinear()
		.domain(d3.extent(data, d => d.anzahl))
		.range([0, 100]);
	var circles = svg.selectAll("circle")
		.data(data)
		.join(
			enter => entercircs(enter),
			update => updatecircs(update),
			exit => exitcircs(exit)
		)
	function entercircs(enter) {
		enter.append("circle")
			.transition()
			.attr("r", function (d) { return rscale(d.anzahl) })
			.style("fill", function (d) {
				return colScale(d.tags)
			})
		console.log("enter happened")
	}

	function updatecircs(update) {
		update
			.selectAll("circle")
			.transition()
			.attr("r", function (d) { return rscale(d.anzahl) })
			.style("fill", function (d) {
				return colScale(d.tags)
			})
		console.log("update happened")
	}
	function exitcircs(exit) {
		exit
			.selectAll("circle")
			.remove()
		console.log("exit happened")
	}



}
async function barchart1() {

}
// kick things off
init();
testarrayfunc()