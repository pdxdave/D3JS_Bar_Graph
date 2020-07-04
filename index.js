// 1.
const svg = d3.select('.canvas')
    .append('svg')
        .attr('width', 800)
        .attr('height', 800);

// 2.
const margin = {top: 20, bottom: 100, right: 20, left: 100};
const barGraphWidth = 800 - margin.left - margin.right;
const barGraphHeight = 800 - margin.top - margin.bottom;

// 3. 
const graph = svg.append('g')
    .attr('width', barGraphWidth)
    .attr('height', barGraphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

// 4.
const xGroup = graph.append('g')
    // w/o this the graph charts are upside down.
    .attr('transform', `translate(0, ${barGraphHeight})`);
const yGroup = graph.append('g');


// bring in json data
d3.json('homes.json')
    .then(data => {

        // 5.
        const y = d3.scaleLinear() 
            .domain([0, d3.max(data, d => d.homes)]) 
            .range([barGraphHeight, 0]); 

        // 6.
        const x = d3.scaleBand()
            .domain(data.map(item => item.county))
            .range([0, 700])
            .paddingInner(0.5)
            .paddingOuter(0.5)

        // select all the rect, eventhough we don't have any and pass data
        const rects = graph.selectAll('rect')
            .data(data)

        // create a bar
        rects.attr('width', x.bandwidth)
            .attr('height', d => barGraphHeight - y(d.homes))
            .attr('fill', 'orange')
            .attr('x', d => x(d.county))
            .attr('y', d => y(d.homes))
            
        rects.enter()
            .append('rect')
                .attr('width', x.bandwidth)
                .attr('height', d => barGraphHeight - y(d.homes))
                .attr('fill', 'blue')
                .attr('x', d => x(d.county))
                .attr('y', d => y(d.homes))

        // 7.
        const xAxis = d3.axisBottom(x)
        const yAxis = d3.axisLeft(y)

        xGroup.call(xAxis)
        yGroup.call(yAxis)

    })

    /*
       1. connect to canvas and append an svg tag. set h/w properties
       2. margins are created to keep the graph from resting
        against the top and left borders of the page. 
       3. now group the bar graph with the new measurements within 
        the svg. these will be the new attributes. to move into place
        this will require the transform.    
       4. axis bars are needed to show the number of homes sold
        and locations. these are also grouped.
       5. scaleLinear is a d3 method.  it makes sure the graphs don't go off the
        top end of the page. This works with max(). max finds the largest value.
        in this case homes. .domain() is the input value and .range() basically
        halfs it so the data can fit on the page.
       6. scaleBand is a d3 method. it makes sure all the bars will fit w/in
        the graph boundaries. adding more content will just make the bars
        thinner so all of them can fit. we map through all the counties to
        see how many spaces will be required.
       7. Create and call the axis. this must be done here b/c they're relient
        on the data. They are being called though from above. x is the scaleBand, y is the scaleLinear. axisBottom and axisLeft are d3 methods.
    */