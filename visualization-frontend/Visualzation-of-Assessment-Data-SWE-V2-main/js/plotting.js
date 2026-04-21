import { clearPlotMeasureSelector, clearPlotStartDateSelector, clearPlotEndDateSelector, modalPlotSloDescriptionContainer, modalPlotMeasureDescriptionContainer} from '/js/plotModal.js';

import {revealUnselectedSelectorError,} from '/js/inputting.js';
import {clearInputSloSelector } from "/js/inputModal.js";
import * as d3 from 'd3';

//Resets selected SLO to it's default selection.
var clearPlotSloSelector = clearInputSloSelector;

const dashboardLogo = document.querySelector('.landing-page-wrapper');
const chartContainer = document.getElementById('chart-div');
// Loading element is now handled by the LoadingOverlay system


///////////////////////////////////////////////Plotting Modal Elements////////////////////////////////////
const closeButton = document.querySelector("#plottingModal > div > div > div.modal-header > button")
const plottingModalPlotButton  = document.getElementById('plotting-button');
const plottingModalCloseButton = document.querySelector("#plottingModal > div > div > div.modal-footer > button.btn.btn-secondary");
const sloSelectorElement = document.getElementById('SLO-selector-plt');
const measureSelectorElement = document.getElementById('measure-selector-plt');
const startDateSelectorElement = document.getElementById('start-selector-plt');
const endDateSelectorElement = document.getElementById('end-selector-plt');
const plotSettingsContainer = document.getElementById('settings-container');
//////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////Options Containers For Radio Buttons On Plot Setttings//////////////////////////
const targetPlotOptionButtonBoth = document.querySelector("#settings-container > div.option.\\31 ");
const targetPlotOptionButtonT1 = document.querySelector("#settings-container > div.option.\\32 ");
const targetPlotOptionButtonT2 = document.querySelector("#settings-container > div.option.\\33 ");
const targetPlotColorOptionButtonT1 = document.querySelector("#settings-container > div.option.t1.color");
const targetPlotColorOptionButtonT2 = document.querySelector("#settings-container > div.option.t2.color");
/////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////// Radio Buttons On Plot Settings/////////////////////////////////////
const targetPlotRadioButtonBoth = document.querySelector("#\\=target-radio-1");
const targetPlotRadioButtonT1 = document.querySelector("#\\=target-radio-2");
const targetPlotRadioButtonT2 = document.querySelector("#\\=target-radio-3");
const targetPlotColorRadioButtonT1 = document.querySelector("#t1-color-selector");
const targetPlotColorRadioButtonT2 = document.querySelector("#t2-color-selector");
const pointSizeSelector = document.querySelector("#point-size-selector");
const lineSizeSelector = document.querySelector("#line-size-selector");
///////////////////////////////////////////////////////////////////////////////////////////////////////////


//plot based input fields, (all selector elments)
const inputFields = {
    sloSelector: sloSelectorElement,
    measureSelector: measureSelectorElement,
    startDateSelector: startDateSelectorElement,
    endDateSelector:endDateSelectorElement
};


//All elements that have to do with the display, logo, plot settings etc.
const displayElements = {

    dashboardLogo: dashboardLogo,
    plottingModalCloseButton: plottingModalCloseButton,
    chartContainer: chartContainer,
    plotSettingsContainer: plotSettingsContainer,
    targetPlotOptionButtonBoth: targetPlotOptionButtonBoth,
    targetPlotOptionButtonT1:targetPlotOptionButtonT1,
    targetPlotOptionButtonT2: targetPlotOptionButtonT2,
    targetPlotColorOptionButtonT2: targetPlotColorOptionButtonT2,
    targetPlotRadioButtonBoth: targetPlotRadioButtonBoth,
    targetPlotRadioButtonT1: targetPlotRadioButtonT1 

};


var chartObj; //Variable which holds the different instances of the graph.

// Plot context state management
let currentPlotContext = {
    slo: null,
    sloDesc: null,
    measure: null,
    measureDesc: null,
    startTerm: null,
    endTerm: null
};

// Function to update plot context display
function updatePlotContextDisplay() {
    const sloValue = document.getElementById('slo-value');
    const measureValue = document.getElementById('measure-value');
    const datesValue = document.getElementById('dates-value');
    
    // Update SLO chip
    if (currentPlotContext.slo) {
        sloValue.textContent = currentPlotContext.slo;
        sloValue.parentElement.title = currentPlotContext.sloDesc || '';
    } else {
        sloValue.textContent = '—';
        sloValue.parentElement.title = '';
    }
    
    // Update Measure chip
    if (currentPlotContext.measure) {
        measureValue.textContent = currentPlotContext.measure;
        measureValue.parentElement.title = currentPlotContext.measureDesc || '';
    } else {
        measureValue.textContent = '—';
        measureValue.parentElement.title = '';
    }
    
    // Update Dates chip
    if (currentPlotContext.startTerm && currentPlotContext.endTerm) {
        if (currentPlotContext.startTerm === currentPlotContext.endTerm) {
            datesValue.textContent = currentPlotContext.startTerm;
        } else {
            datesValue.textContent = `${currentPlotContext.startTerm} to ${currentPlotContext.endTerm}`;
        }
        datesValue.parentElement.title = `Date range: ${currentPlotContext.startTerm} to ${currentPlotContext.endTerm}`;
    } else {
        datesValue.textContent = '—';
        datesValue.parentElement.title = '';
    }
}

// Function to update plot context from current selections
function updatePlotContextFromSelections() {
    const sloSelector = document.getElementById('SLO-selector-plt');
    const measureSelector = document.getElementById('measure-selector-plt');
    const startSelector = document.getElementById('start-selector-plt');
    const endSelector = document.getElementById('end-selector-plt');
    
    if (sloSelector.selectedIndex > 0 && measureSelector.selectedIndex > 0 && 
        startSelector.selectedIndex > 0 && endSelector.selectedIndex > 0) {
        
        currentPlotContext.slo = sloSelector.options[sloSelector.selectedIndex].text;
        currentPlotContext.measure = measureSelector.options[measureSelector.selectedIndex].text;
        currentPlotContext.startTerm = startSelector.options[startSelector.selectedIndex].text;
        currentPlotContext.endTerm = endSelector.options[endSelector.selectedIndex].text;
        
        // Get descriptions from the description containers
        const sloDescContainer = document.getElementById('description-container-SLO-plt');
        const measureDescContainer = document.getElementById('description-container-measure-plt');
        
        if (sloDescContainer && sloDescContainer.style.display !== 'none') {
            const sloDescText = document.getElementById('modal-SLO-description-plt');
            currentPlotContext.sloDesc = sloDescText ? sloDescText.value : '';
        }
        
        if (measureDescContainer && measureDescContainer.style.display !== 'none') {
            const measureDescText = document.getElementById('modal-measure-description-plt');
            currentPlotContext.measureDesc = measureDescText ? measureDescText.value : '';
        }
        
        updatePlotContextDisplay();
    }
}

// (i.e SLO, Measure) filters selectors based on the ones that are unselected and returns them in an array.
function getAllUnslectedSelectors(inputFields) {
    
    if (inputFields == null) {
        return [];
    }

    const unselectedInputSelectors = [];
    
    const inputSelectors = [
        inputFields.sloSelector,
        inputFields.measureSelector,
        inputFields.startDateSelector,
        inputFields.endDateSelector
    ];

    for (let currSelector of inputSelectors) {

        const defaultSelectorValue = currSelector.options[0].text;
        const selectorValue = currSelector.options[currSelector.selectedIndex].text;
            
        if (defaultSelectorValue == selectorValue) {

            unselectedInputSelectors.push(currSelector);

        }

    }

    return unselectedInputSelectors;
}



//Hides all selector errors SLO selector, measure Selector etc.
function hideAllSelectorErrors(sloSelector, measureSelector, startDateSelector, endDateSelector) {
    
    hideUnselectedSelectorError(sloSelector);
    hideUnselectedSelectorError(measureSelector);
    hideUnselectedSelectorError(startDateSelector);
    hideUnselectedSelectorError(endDateSelector);

}



//Hides the landing page.
function hideDashboardLogo(dashboardLogo) {

    dashboardLogo.style.display = "none";

}



//Closes plotting modal.
function closePlottingModal() {
    
    closeButton.click();

}



//Hides both description text boxes (slo and measure).
function hideAllPlotSelectorDescriptions(sloSelectorDesContainer,measureSelectorDesContainer){

    sloSelectorDesContainer.style.display = 'none';
    measureSelectorDesContainer.style.display = 'none';

}



//Return all SLO selectors into their default state.
function clearPlotModalSelectors(inputFields) {
  
    clearPlotSloSelector(inputFields.sloSelector);
    clearPlotMeasureSelector(inputFields.measureSelector);
    clearPlotStartDateSelector(inputFields.startDateSelector,);
    clearPlotEndDateSelector(inputFields.endDateSelector);
    
}



//Displays the plot settings area.
function displayPlotSettingsArea(plotSettingsContainer) {

    plotSettingsContainer.style.display = "flex";

}



//Returns Boolean on whether the t1 button is checked or not.
function target1RadioButtonChecked(targetPlotRadioButtonT1) {

    if (targetPlotRadioButtonT1.checked) {
        
        return true;

    }

    return false;
    
}



//Returns a boolean on whether or not the both target button is checked.
function bothTargetsRadioButttonChecked(targetPlotRadioButtonBoth){

    if (targetPlotRadioButtonBoth.checked) {
        
        return true;

    }

    return false;

}



//Handles plotting when user selects a radio button that controls which targets should be plotted.
async function plotTransitionEditedTargets(plotDataUrl,displayElements) {
  
    //If chart container is filled 
    if (displayElements.chartContainer.children.length > 0) {

        await removeChartElement(displayElements.chartContainer);
        
    }
     
    window.AppLoader.showLoading('Fetching plot data...');

    
    if (bothTargetsRadioButttonChecked(displayElements.targetPlotRadioButtonBoth)) {
        
        await plotChartWithBothTargets(plotDataUrl);

    }
    else {//If a single target radio button is checked

        //If T1 radio button is checked, plot for T1
        if (target1RadioButtonChecked(displayElements.targetPlotRadioButtonT1)) {
           
            await plotChartBasedOnTargets(plotDataUrl, "T1");

        }
        else {//otherwise plot for T2
            
            await plotChartBasedOnTargets(plotDataUrl, "T2");

        }

    }

    await displayChartElement(displayElements.chartContainer);
    
}



//Handles plotting when plotting both targets.
async function plotTransitionBothTargets(plotDataUrl,displayElements) {

    await hideDashboardLogo(displayElements.dashboardLogo);
   
    await closePlottingModal();
  
    //If chart container is filled 
    if (displayElements.chartContainer.children.length > 0) {

        await removeChartElement(displayElements.chartContainer);

    }
     
    window.AppLoader.showLoading('Fetching plot data...');

    await plotChartWithBothTargets(plotDataUrl);

    await displayChartElement(displayElements.chartContainer);

    setTimeout(() => {//Displays plot settings area and the buttons which can edit charts

        displayPlotSettingsArea(displayElements.plotSettingsContainer);
        revealBothTargetRadioButton(displayElements.targetPlotOptionButtonBoth);
        revealTargetT1RadioButton(displayElements.targetPlotOptionButtonT1);
        revealTargetT2RadioButton(displayElements.targetPlotOptionButtonT2);
        revealTargetColorSelectorT2(displayElements.targetPlotColorOptionButtonT2);
        checkRadioButton(displayElements.targetPlotRadioButtonBoth);

    }, 2100);
    
}



//Handles plotting when there is only one target.
async function plotTransitionSingleTarget(plotDataUrl,displayElements) {
    
    await hideDashboardLogo(displayElements.dashboardLogo);
   
    await closePlottingModal();

    if (displayElements.chartContainer.children.length > 0) {

        await removeChartElement(displayElements.chartContainer);

    }

    window.AppLoader.showLoading('Fetching plot data...');

    await plotChartBasedOnTargets(plotDataUrl, "T1");

    await displayChartElement(displayElements.chartContainer);

    setTimeout(() => {//Displays plotting area and hides all other options beside T1 options

        displayPlotSettingsArea(displayElements.plotSettingsContainer);
        hideBothTargetRadioButton(displayElements.targetPlotOptionButtonBoth);
        hideTargetT2RadioButton(displayElements.targetPlotOptionButtonT2);
        hideTargetColorSelectorT2(displayElements.targetPlotColorOptionButtonT2);
        checkRadioButton(displayElements.targetPlotRadioButtonT1);
        hideTargetT1RadioButton(displayElements.targetPlotOptionButtonT1);
    
    }, 2100);

}



//Handles plotting when a color is selected/changed.
async function plotTransitionEditedTargetColors(plotDataUrl,displayElements) {

    window.AppLoader.showLoading('Updating chart colors...');

    if (bothTargetsRadioButttonChecked(displayElements.targetPlotRadioButtonBoth)) {

        await plotChartWithBothTargets(plotDataUrl);

    }
    else {

        if (target1RadioButtonChecked(displayElements.targetPlotRadioButtonT1)) {

            await plotChartBasedOnTargets(plotDataUrl, "T1" );

        }
        else {

            await plotChartBasedOnTargets(plotDataUrl, "T2");
   
        }

    }

    await displayChartElement(displayElements.chartContainer);
    
}



//Handles plotting when the linesize of a target is selected/changed.
async function plotTransitonEditedGraphLineSize(plotDataUrl,displayElements) {

    window.AppLoader.showLoading('Updating line size...');

    if (bothTargetsRadioButttonChecked(displayElements.targetPlotRadioButtonBoth)) {

        await plotChartWithBothTargets(plotDataUrl);
       
    }
    else {

        if (target1RadioButtonChecked(displayElements.targetPlotRadioButtonT1)) {

            await plotChartBasedOnTargets(plotDataUrl, "T1");
        
        }
        else {

            await plotChartBasedOnTargets(plotDataUrl, "T2");
            
        }

    }

    await displayChartElement(displayElements.chartContainer);

}



//Handles plotting when the point size of a target is selected/changed.
async function plotTransitionEditedGraphPointSize(plotDataUrl,displayElements) {

    window.AppLoader.showLoading('Updating point size...');

    if (bothTargetsRadioButttonChecked(displayElements.targetPlotRadioButtonBoth)) {

        plotChartWithBothTargets(plotDataUrl);    
        
    }
    else {

        if (target1RadioButtonChecked(displayElements.targetPlotRadioButtonT1)) {

            await plotChartBasedOnTargets(plotDataUrl, "T1");
     
        }
        else {

            await plotChartBasedOnTargets(plotDataUrl, "T2");
            
        }

    }

    await displayChartElement(displayElements.chartContainer);

}
 


//Loads a 2D array with the data needed to plot the graph for both targets.
function loadDataTableBothTargets(plotDataObj){
    
    if (plotDataObj == null || typeof(plotDataObj) !== 'object' ) {

        return [];

    }


    const numberOfKeysInObj = Object.keys(plotDataObj).length;

    if (numberOfKeysInObj == 0){
        
        return [];
    
    }

    let result = [
      
      ['X', 'Percentage Met for T1', 'Percentage Met for T2', plotDataObj.mostRecentT1Des, plotDataObj.mostRecentT2Des]
      
    ];

    const cols = plotDataObj.dates.length;

    for (let index = 0; index < cols; index++){
      
      let rowArray = [];
      
        rowArray.push(plotDataObj.dates[index]);
        rowArray.push(plotDataObj.percentagesMetT1[index]);
        rowArray.push(plotDataObj.percentagesMetT2[index]);
        rowArray.push(plotDataObj.T1[index]);
        rowArray.push(plotDataObj.T2[index]);
        result.push(rowArray);
    }

    return result;
    
}



//Loads a 2D array with the data needed to plot the graph for a single target.
function loadDataTableBasedOnTargets(plotDataObj, target) {

    if (plotDataObj == null || typeof(plotDataObj) !== 'object' ) {

        return [];

    }


    const numberOfKeysInObj = Object.keys(plotDataObj).length;

    if (numberOfKeysInObj == 0){
        
        return [];
    
    }
    
    if (target == "T1") { 

        let result = [
        
            ['X','Percentage Met for T1',plotDataObj.mostRecentT1Des]
    
        ];
  

        const cols = plotDataObj.dates.length; 

        for(let index = 0; index < cols; index++){
            
            let rowArray = [];

            rowArray.push(plotDataObj.dates[index]);
            rowArray.push(plotDataObj.percentagesMetT1[index]);
            rowArray.push(plotDataObj.T1[index]);
            result.push(rowArray);

        }
        
        return result; 
            
    }
    else {
        
        

        let result = [

            ['X', 'Percentage Met for T2', plotDataObj.mostRecentT2Des]
            
        ];

        const cols = plotDataObj.dates.length; 

        for (let index = 0; index < cols; index++){
            
            let rowArray = [];
            
            rowArray.push(plotDataObj.dates[index]);
            rowArray.push(plotDataObj.percentagesMetT1[index]);
            rowArray.push(plotDataObj.T2[index]);
            
            result.push(rowArray);
        }

        return result;
    
    }

}



//Displays the element where the graph is rendered.
function displayChartElement(chartContainer) {

    chartContainer.style.display = "block";

}



//Removes the element that the chart is plotted on.
function removeChartElement(chartContainer) {

    let child = chartContainer.children[0];

    chartContainer.removeChild(child);
    chartContainer.style.display = 'none'; 

}



//Displays the T1 color selector in the settings section. 
function displayColorSelectorT1(targetPlotColorSelectorButtonT1) {

    targetPlotColorSelectorButtonT1.style.display = "block";

}



//Displays the T2 color selector in the settings section. 
function displayColorSelectorT2(targetPlotColorSelectorButtonT2) {

    targetPlotColorSelectorButtonT2.style.display = "block";

}



//Hides the T1 color selector in the settings section. 
function hideColorSelectorT1(targetPlotColorOptionButtonT1) { 

    targetPlotColorOptionButtonT1.style.display = "none";

}



//Hides the T2 color selector in the settings section. 
function hideColorSelectorT2(targetPlotColorOptionButtonT2) { 

    targetPlotColorOptionButtonT2.style.display = "none";

}



function plotChartWithBothTargets(requestUrl) {

    let t1Color = document.querySelector("#t1-color-selector").value;
    let t2Color = document.querySelector("#t2-color-selector").value;
    let pointSize = parseInt(document.querySelector("#point-size-selector").value);
    let lineSize = parseInt(document.querySelector("#line-size-selector").value);

    setTimeout(() => {

        let plottingDataObj;
        let pickedColors = [t1Color, t2Color];

        // Update loading message to show chart is being drawn
        if (window.AppLoader) {
            window.AppLoader.showLoading('Drawing chart...');
        }

        axios.get(requestUrl).then(response => {
        
        plottingDataObj = response.data;
  
        drawChartWithD3();

        function drawChartWithD3() {
            // Clear previous chart
            d3.select('#chart-div').selectAll('*').remove();
            
            const data = loadDataTableBothTargets(plottingDataObj);
            if (data.length === 0) {
                // Hide loading if no data
                if (window.AppLoader) {
                    window.AppLoader.hideLoading();
                }
                return;
            }
            
            // Skip header row and prepare data for D3
            const chartData = data.slice(1).map(row => ({
                date: row[0],
                t1Percentage: row[1],
                t2Percentage: row[2],
                t1Value: row[3],
                t2Value: row[4]
            }));
            
            // Calculate legend space requirements first
            const legendItemHeight = 20; // Height per legend item
            const legendGap = 10; // Gap between items
            const legendSpacing = 20; // Space between chart and legend
            const totalLegendHeight = 2 * legendItemHeight + legendGap + legendSpacing;
            
            // Adjust bottom margin to accommodate legend properly
            const margin = {top: 40, right: 60, bottom: 60, left: 60};
            const width = chartContainer.clientWidth - margin.left - margin.right;
            const height = chartContainer.clientHeight - margin.top - margin.bottom;
            
            // Create SVG with proper height to accommodate legend
            const svg = d3.select('#chart-div')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom + totalLegendHeight)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
            
            console.log('Chart dimensions:', { width, height, margin });
            console.log('SVG dimensions:', { svgWidth: width + margin.left + margin.right, svgHeight: height + margin.top + margin.bottom + totalLegendHeight });
            
            // Scales
            const xScale = d3.scaleBand()
                .domain(chartData.map(d => d.date))
                .range([0, width])
                .padding(0.1);
            
            // Y axis
            const t1Percentages = chartData
                .map(d => d.t1Percentage)
                .filter(value => Number.isFinite(value));
            const t2Percentages = chartData
                .map(d => d.t2Percentage)
                .filter(value => Number.isFinite(value));

            const maxT1Percentage = t1Percentages.length > 0 ? d3.max(t1Percentages) : 0;
            const maxT2Percentage = t2Percentages.length > 0 ? d3.max(t2Percentages) : 0;
            const maxPercentage = Math.max(maxT1Percentage, maxT2Percentage);
            const yAxisMax = Number.isFinite(maxPercentage) && maxPercentage > 0 ? maxPercentage * 1.15 : 100;
            
            console.log('Y-axis calculation:', { 
                maxT1Percentage, 
                maxT2Percentage, 
                maxPercentage, 
                yAxisMax,
                chartData: chartData.map(d => ({ date: d.date, t1: d.t1Percentage, t2: d.t2Percentage }))
            });
            
            const yScale = d3.scaleLinear()
                .domain([0, yAxisMax]) // Add 15% headroom above max
                .range([height, 0]);
            
            // Grid lines
            const yGrid = d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat('')
                .ticks(5);
            
            svg.append('g')
                .attr('class', 'grid')
                .call(yGrid)
                .style('stroke', 'rgba(26, 140, 255, 0.1)')
                .style('stroke-width', 1);
            
            // X axis
            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(xScale))
                .style('font-size', '12px')
                .style('color', '#495057');
            
            // Y axis
            svg.append('g')
                .call(d3.axisLeft(yScale))
                .style('font-size', '12px')
                .style('color', '#495057');
            
            // Axis labels
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height + margin.bottom - 10)
                .style('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', '600')
                .style('fill', '#495057')
                .text('School Term');
            
            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', -margin.left + 20)
                .attr('x', -height / 2)
                .style('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', '600')
                .style('fill', '#495057')
                .text('Percentage-met');
            
            // Title
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', -margin.top / 2)
                .style('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('font-weight', '600')
                .style('fill', '#1a8cff')
                .text(plottingDataObj.title);
            
            // T1 Line
            const t1Line = d3.line()
                .defined(d => Number.isFinite(d.t1Percentage))
                .x(d => xScale(d.date) + xScale.bandwidth() / 2)
                .y(d => yScale(d.t1Percentage))
                .curve(d3.curveMonotoneX);
            
            svg.append('path')
                .datum(chartData)
                .attr('fill', 'none')
                .attr('stroke', t1Color)
                .attr('stroke-width', lineSize)
                .attr('d', t1Line);
            
            // T2 Line
            const t2Line = d3.line()
                .defined(d => Number.isFinite(d.t2Percentage))
                .x(d => xScale(d.date) + xScale.bandwidth() / 2)
                .y(d => yScale(d.t2Percentage))
                .curve(d3.curveMonotoneX);
            
            svg.append('path')
                .datum(chartData)
                .attr('fill', 'none')
                .attr('stroke', t2Color)
                .attr('stroke-width', lineSize)
                .attr('d', t2Line);
            
            // T1 Points
            svg.selectAll('.t1-points')
                .data(chartData.filter(d => Number.isFinite(d.t1Percentage)))
                .enter()
                .append('rect')
                .attr('class', 't1-points')
                .attr('x', d => xScale(d.date) + xScale.bandwidth() / 2 - pointSize / 2)
                .attr('y', d => yScale(d.t1Percentage) - pointSize / 2)
                .attr('width', pointSize)
                .attr('height', pointSize)
                .attr('fill', t1Color)
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 2)
                .style('cursor', 'pointer')
                .on('mouseover', function(event, d) {
                    d3.select(this).attr('stroke-width', 3);
                    showTooltip(event, `T1: ${d.t1Percentage}% (${d.t1Value})`);
                })
                .on('mouseout', function() {
                    d3.select(this).attr('stroke-width', 2);
                    hideTooltip();
                });
            
            // T2 Points
            svg.selectAll('.t2-points')
                .data(chartData.filter(d => Number.isFinite(d.t2Percentage)))
                .enter()
                .append('polygon')
                .attr('class', 't2-points')
                .attr('points', d => {
                    const x = xScale(d.date) + xScale.bandwidth() / 2;
                    const y = yScale(d.t2Percentage);
                    const size = pointSize / 2;
                    return `${x},${y - size} ${x - size},${y + size} ${x + size},${y + size}`;
                })
                .attr('fill', t2Color)
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 2)
                .style('cursor', 'pointer')
                .on('mouseover', function(event, d) {
                    d3.select(this).attr('stroke-width', 3);
                    showTooltip(event, `T2: ${d.t2Percentage}% (${d.t2Value})`);
                })
                .on('mouseout', function() {
                    d3.select(this).attr('stroke-width', 2);
                    hideTooltip();
                });
            
            // Legend - positioned below the graph (vertical stacked layout)
            const legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(0, ${height + margin.bottom + 10})`);
            
            console.log('Legend position:', { legendY: height + margin.bottom + 10, chartHeight: height, marginBottom: margin.bottom });
            
            // Vertical legend layout - centered below chart
            const maxTextWidth = 200; // Maximum text width to prevent overlap
            
            // Calculate legend dimensions for vertical layout
            const legendStartX = (width - maxTextWidth) / 2; // Center horizontally
            
            console.log('Legend dimensions:', { legendItemHeight, legendGap, totalLegendHeight, legendStartX });
            console.log('Legend positioning details:', { 
                height, 
                marginBottom: margin.bottom, 
                legendSpacing, 
                legendY: height + margin.bottom + legendSpacing,
                svgHeight: height + margin.top + margin.bottom + totalLegendHeight
            });
            
            // T1 Legend Item (first row)
            legend.append('rect')
                .attr('x', legendStartX)
                .attr('y', 0)
                .attr('width', 16)
                .attr('height', 16)
                .attr('fill', t1Color)
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 1.5);
            
            // T1 Text
            legend.append('text')
                .attr('x', legendStartX + 25)
                .attr('y', 13)
                .style('font-size', '12px')
                .style('font-weight', '600')
                .style('fill', '#495057')
                .style('max-width', `${maxTextWidth - 30}px`)
                .text(plottingDataObj.mostRecentT1Des);
            
            // T2 Legend Item (second row)
            legend.append('polygon')
                .attr('points', `${legendStartX},${legendItemHeight + legendGap} ${legendStartX + 8},${legendItemHeight + legendGap + 8} ${legendStartX + 16},${legendItemHeight + legendGap}`)
                .attr('fill', t2Color)
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 1.5);
            
            // T2 Text
            legend.append('text')
                .attr('x', legendStartX + 25)
                .attr('y', legendItemHeight + legendGap + 13)
                .style('font-size', '12px')
                .style('font-weight', '600')
                .style('fill', '#495057')
                .style('max-width', `${maxTextWidth - 30}px`)
                .text(plottingDataObj.mostRecentT2Des);
            
            // Tooltip
            const tooltip = d3.select('#chart-div')
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(0, 0, 0, 0.8)')
                .style('color', 'white')
                .style('padding', '8px 12px')
                .style('border-radius', '6px')
                .style('font-size', '12px')
                .style('pointer-events', 'none')
                .style('opacity', 0)
                .style('transition', 'opacity 0.2s');
            
            function showTooltip(event, text) {
                tooltip.style('opacity', 1)
                    .html(text)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            }
            
            function hideTooltip() {
                tooltip.style('opacity', 0);
            }
            
            // Hide loading after chart is fully drawn
            if (window.AppLoader) {
                window.AppLoader.hideLoading();
            }
        }
        
    }).catch((error) => {
        console.error('Failed to load plot data for both targets.', error);
        if (window.AppLoader) {
            window.AppLoader.hideLoading();
        }
    });
        
    }, 2000);
   
}



//Plots based on the target that was passed in, T1 or T2 
function plotChartBasedOnTargets(requestUrl, target) {

    let t1Color = document.querySelector("#t1-color-selector").value;
    let t2Color = document.querySelector("#t2-color-selector").value;
    let pointSize = parseInt(document.querySelector("#point-size-selector").value);
    let lineSize = parseInt(document.querySelector("#line-size-selector").value);
    
    setTimeout(() => {
    
        let plottingDataObj;
        let pickedColors = target == "T1" ? [t1Color, t1Color] : [t2Color, t2Color];

        // Update loading message to show chart is being drawn
        if (window.AppLoader) {
            window.AppLoader.showLoading('Drawing chart...');
        }

    axios.get(requestUrl).then(response => {
        
        plottingDataObj = response.data;
      

        drawChartBasedOnTargetWithD3();

        function drawChartBasedOnTargetWithD3() {
            // Clear previous chart
            d3.select('#chart-div').selectAll('*').remove();
            
            const data = loadDataTableBasedOnTargets(plottingDataObj, target);
            if (data.length === 0) {
                // Hide loading if no data
                if (window.AppLoader) {
                    window.AppLoader.hideLoading();
                }
                return;
            }
            
            // Skip header row and prepare data for D3
            const chartData = data.slice(1).map(row => ({
                date: row[0],
                percentage: row[1],
                value: row[2]
            }));
            
            // Calculate legend space requirements first
            const legendItemHeight = 20; // Height per legend item
            const legendSpacing = 20; // Space between chart and legend
            const totalLegendHeight = legendItemHeight + legendSpacing;
            
            // Adjust bottom margin to accommodate legend properly
            const margin = {top: 40, right: 60, bottom: 60, left: 60};
            const width = chartContainer.clientWidth - margin.left - margin.right;
            const height = chartContainer.clientHeight - margin.top - margin.bottom;
            
            // Create SVG with proper height to accommodate legend
            const svg = d3.select('#chart-div')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom + totalLegendHeight)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
            
            console.log('Single target chart dimensions:', { width, height, margin });
            console.log('Single target SVG dimensions:', { svgWidth: width + margin.left + margin.right, svgHeight: height + margin.top + margin.bottom + totalLegendHeight });
            
            // Scales
            const xScale = d3.scaleBand()
                .domain(chartData.map(d => d.date))
                .range([0, width])
                .padding(0.1);
            
            // Y axis
            const percentages = chartData
                .map(d => d.percentage)
                .filter(value => Number.isFinite(value));
            const maxPercentage = percentages.length > 0 ? d3.max(percentages) : 0;
            const yAxisMax = Number.isFinite(maxPercentage) && maxPercentage > 0 ? maxPercentage * 1.15 : 100;
            
            console.log('Single target Y-axis calculation:', { 
                maxPercentage, 
                yAxisMax,
                chartData: chartData.map(d => ({ date: d.date, percentage: d.percentage }))
            });
            
            const yScale = d3.scaleLinear()
                .domain([0, yAxisMax]) // Add 15% headroom above max
                .range([height, 0]);
            
            // Grid lines
            const yGrid = d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat('')
                .ticks(5);
            
            svg.append('g')
                .attr('class', 'grid')
                .call(yGrid)
                .style('stroke', 'rgba(26, 140, 255, 0.1)')
                .style('stroke-width', 1);
            
            // X axis
            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(xScale))
                .style('font-size', '12px')
                .style('color', '#495057');
            
            // Y axis
            svg.append('g')
                .call(d3.axisLeft(yScale))
                .style('font-size', '12px')
                .style('color', '#495057');
            
            // Axis labels
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height + margin.bottom - 10)
                .style('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', '600')
                .style('fill', '#495057')
                .text('School Term');
            
            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', -margin.left + 20)
                .attr('x', -height / 2)
                .style('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', '600')
                .style('fill', '#495057')
                .text('Percentage-met');
            
            // Title
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', -margin.top / 2)
                .style('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('font-weight', '600')
                .style('fill', '#1a8cff')
                .text(plottingDataObj.title);
            
            // Line
            const line = d3.line()
                .defined(d => Number.isFinite(d.percentage))
                .x(d => xScale(d.date) + xScale.bandwidth() / 2)
                .y(d => yScale(d.percentage))
                .curve(d3.curveMonotoneX);
            
            svg.append('path')
                .datum(chartData)
                .attr('fill', 'none')
                .attr('stroke', target === "T1" ? t1Color : t2Color)
                .attr('stroke-width', lineSize)
                .attr('d', line);
            
            // Points
            const pointColor = target === "T1" ? t1Color : t2Color;
            const pointShape = target === "T1" ? 'rect' : 'polygon';
            
            if (target === "T1") {
                // Square points for T1
                svg.selectAll('.target-points')
                    .data(chartData.filter(d => Number.isFinite(d.percentage)))
                    .enter()
                    .append('rect')
                    .attr('class', 'target-points')
                    .attr('x', d => xScale(d.date) + xScale.bandwidth() / 2 - pointSize / 2)
                    .attr('y', d => yScale(d.percentage) - pointSize / 2)
                    .attr('width', pointSize)
                    .attr('height', pointSize)
                    .attr('fill', pointColor)
                    .attr('stroke', '#ffffff')
                    .attr('stroke-width', 2)
                    .style('cursor', 'pointer')
                    .on('mouseover', function(event, d) {
                        d3.select(this).attr('stroke-width', 3);
                        showTooltip(event, `${target}: ${d.percentage}% (${d.value})`);
                    })
                    .on('mouseout', function() {
                        d3.select(this).attr('stroke-width', 2);
                        hideTooltip();
                    });
            } else {
                // Star points for T2
                svg.selectAll('.target-points')
                    .data(chartData.filter(d => Number.isFinite(d.percentage)))
                    .enter()
                    .append('polygon')
                    .attr('class', 'target-points')
                    .attr('points', d => {
                        const x = xScale(d.date) + xScale.bandwidth() / 2;
                        const y = yScale(d.percentage);
                        const size = pointSize / 2;
                        return `${x},${y - size} ${x - size},${y + size} ${x + size},${y + size}`;
                    })
                    .attr('fill', pointColor)
                    .attr('stroke', '#ffffff')
                    .attr('stroke-width', 2)
                    .style('cursor', 'pointer')
                    .on('mouseover', function(event, d) {
                        d3.select(this).attr('stroke-width', 3);
                        showTooltip(event, `${target}: ${d.percentage}% (${d.value})`);
                    })
                    .on('mouseout', function() {
                        d3.select(this).attr('stroke-width', 2);
                        hideTooltip();
                    });
            }
            
            // Legend - positioned below the graph (vertical stacked layout)
            const legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(0, ${height + margin.bottom + 10})`);
            
            console.log('Single target legend position:', { legendY: height + margin.bottom + 10, chartHeight: height, marginBottom: margin.bottom });
            
            // Vertical legend layout - centered below chart
            const maxTextWidth = 200; // Maximum text width to prevent overlap
            
            // Calculate legend dimensions for vertical layout
            const legendStartX = (width - maxTextWidth) / 2; // Center horizontally
            
            console.log('Single target legend dimensions:', { legendItemHeight, maxTextWidth, legendStartX });
            console.log('Single target legend positioning details:', { 
                height, 
                marginBottom: margin.bottom, 
                legendSpacing, 
                legendY: height + margin.bottom + legendSpacing,
                svgHeight: height + margin.top + margin.bottom + totalLegendHeight
            });
            
            // Legend marker
            if (target === "T1") {
                legend.append('rect')
                    .attr('x', legendStartX)
                    .attr('y', 0)
                    .attr('width', 16)
                    .attr('height', 16)
                    .attr('fill', pointColor)
                    .attr('stroke', '#ffffff')
                    .attr('stroke-width', 1.5);
            } else {
                legend.append('polygon')
                    .attr('points', `${legendStartX},0 ${legendStartX + 8},8 ${legendStartX + 16},0`)
                    .attr('fill', pointColor)
                    .attr('stroke', '#ffffff')
                    .attr('stroke-width', 1.5);
            }
            
            // Legend text
            legend.append('text')
                .attr('x', legendStartX + 25)
                .attr('y', 13)
                .style('font-size', '12px')
                .style('font-weight', '600')
                .style('fill', '#495057')
                .style('max-width', `${maxTextWidth - 30}px`)
                .text(target === "T1" ? plottingDataObj.mostRecentT1Des : plottingDataObj.mostRecentT2Des);
            
            // Tooltip
            const tooltip = d3.select('#chart-div')
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(0, 0, 0, 0.8)')
                .style('color', 'white')
                .style('padding', '8px 12px')
                .style('border-radius', '6px')
                .style('font-size', '12px')
                .style('pointer-events', 'none')
                .style('opacity', 0)
                .style('transition', 'opacity 0.2s');
            
            function showTooltip(event, text) {
                tooltip.style('opacity', 1)
                    .html(text)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            }
            
            function hideTooltip() {
                tooltip.style('opacity', 0);
            }
            
            // Hide loading after chart is fully drawn
            if (window.AppLoader) {
                window.AppLoader.hideLoading();
            }
        }
     
    }).catch((error) => {
        console.error(`Failed to load plot data for target ${target}.`, error);
        if (window.AppLoader) {
            window.AppLoader.hideLoading();
        }
    });
        
    }, 2000);
}



// Loading is now handled by the LoadingOverlay system
 


//Returns an endpoint (url string) based on all the selected information for plotting. 
function generatePlotDataQueryUrl() {

    const currentSelectedSlo = sloSelectorElement.options[sloSelectorElement.selectedIndex].text;
    const currentSelectedMeasure = measureSelectorElement.options[measureSelectorElement.selectedIndex].text;
    const currentSelectedStartDate = startDateSelectorElement.options[startDateSelectorElement.selectedIndex].text;
    const currentSelectedEndDate = endDateSelectorElement.options[endDateSelectorElement.selectedIndex].text;

            const url = `https://class-assessment-data-visualizer.onrender.com/plot?slo=${currentSelectedSlo}&measure=${currentSelectedMeasure}&start_date=${currentSelectedStartDate}&end_date=${currentSelectedEndDate}`;

    return url;

}


 
//Return a boolean based on whether all the plotting data is selected or not. 
function allPlottingInfoIsSelected(sloSelectorElement, measureSelectorElement, startDateSelectorElement, endDateSelectorElement) {
    
    let defaultSelectedSlo = sloSelectorElement.options[0].text;
    let defaultSelectedMeasure = measureSelectorElement.options[0].text;
    let defaultSelectedStartDate = startDateSelectorElement.options[0].text;
    let defaultSelectedEndDate = endDateSelectorElement.options[0].text;

    let currentSelectedSlo = sloSelectorElement.options[sloSelectorElement.selectedIndex].text;
    let currentSelectedMeasure = measureSelectorElement.options[measureSelectorElement.selectedIndex].text;
    let currentSelectedStartDate = startDateSelectorElement.options[startDateSelectorElement.selectedIndex].text;
    let currentSelectedEndDate = endDateSelectorElement.options[endDateSelectorElement.selectedIndex].text;
    
    
    //All selected info is not equal to their default selections
    if (currentSelectedSlo != defaultSelectedSlo && currentSelectedMeasure != defaultSelectedMeasure && currentSelectedStartDate != defaultSelectedStartDate && currentSelectedEndDate != defaultSelectedEndDate) {

        return true;

    }
   
    return false;

}



//Sets a radio button to checked
function checkRadioButton(radioButton) {
    
    radioButton.checked = true;

}



function hideBothTargetRadioButton(targetPlotOptionButtonBoth) {

    targetPlotOptionButtonBoth.style.display = "none";
    
}



function revealBothTargetRadioButton(targetPlotOptionButtonBoth) {

    targetPlotOptionButtonBoth.style.display = "block";
    
}



//Hides target 1 radio button.
function hideTargetT1RadioButton(targetPlotOptionButtonT1) {

    targetPlotOptionButtonT1.style.display = "none";

}



//Displays target 1 radio button.
function revealTargetT1RadioButton(targetPlotOptionButtonT1) {

    targetPlotOptionButtonT1.style.display = "block";

}



//Hides target 2 radio button.
function hideTargetT2RadioButton(targetPlotOptionButtonT2) {

    targetPlotOptionButtonT2.style.display = "none";

}



//Displays target 2 radio button.
function revealTargetT2RadioButton(targetPlotOptionButtonT2) {

    targetPlotOptionButtonT2.style.display = "block";

}



//Hides the target 2 color selector.
function hideTargetColorSelectorT2(targetPlotColorOptionButtonT2) {

    targetPlotColorOptionButtonT2.style.display = "none";
    
}



//Displays the target 2 color selector.
function revealTargetColorSelectorT2(targetPlotColorOptionButtonT2) {
    
     targetPlotColorOptionButtonT2.style.display = "block";

}



//On Change Event listener for when the the bothTarget radio button is selected.
targetPlotRadioButtonBoth.addEventListener('change', async () => {

    let plotDataUrl = await generatePlotDataQueryUrl();

    // Update plot context before re-plotting
    updatePlotContextFromSelections();

    window.AppLoader.showLoading('Switching to both targets...');
    plotTransitionEditedTargets(plotDataUrl,displayElements);
    displayColorSelectorT1(targetPlotColorOptionButtonT1);
    displayColorSelectorT2(targetPlotColorOptionButtonT2);
    
});



//On Change Event listener for when the the T1 radio button is selected.
targetPlotRadioButtonT1.addEventListener('change', async () => {

    let plotDataUrl = await generatePlotDataQueryUrl();

    // Update plot context before re-plotting
    updatePlotContextFromSelections();

    window.AppLoader.showLoading('Switching to Target 1...');
    plotTransitionEditedTargets(plotDataUrl,displayElements);
    displayColorSelectorT1(targetPlotColorOptionButtonT1);
    hideColorSelectorT2(targetPlotColorOptionButtonT2);
    
});



//On Change Event listener for when the the T2 radio button is selected.
targetPlotRadioButtonT2.addEventListener('change', async () => {

    let plotDataUrl = await generatePlotDataQueryUrl();

    // Update plot context before re-plotting
    updatePlotContextFromSelections();

    window.AppLoader.showLoading('Switching to Target 2...');
    plotTransitionEditedTargets(plotDataUrl,displayElements);
    hideColorSelectorT1(targetPlotColorOptionButtonT1); 
    displayColorSelectorT2(targetPlotColorOptionButtonT2);

});



//On Change Event listener for when the the T1 color radio button is selected.
targetPlotColorRadioButtonT1.addEventListener('change', async () => {

    let plotDataUrl = await generatePlotDataQueryUrl();

    // Update plot context before re-plotting
    updatePlotContextFromSelections();

    window.AppLoader.showLoading('Updating Target 1 color...');
    plotTransitionEditedTargetColors(plotDataUrl,displayElements);
    
});



//On Change Event listener for when the the T2 color radio button is selected.
targetPlotColorRadioButtonT2.addEventListener('change', async () => {
    
    let plotDataUrl = await generatePlotDataQueryUrl();

    // Update plot context before re-plotting
    updatePlotContextFromSelections();

    window.AppLoader.showLoading('Updating Target 2 color...');
    plotTransitionEditedTargetColors(plotDataUrl,displayElements);
    
});



//On Change Event listener for when the the point size radio button is selected.
pointSizeSelector.addEventListener('change', async () => {
    
    let plotDataUrl = await generatePlotDataQueryUrl();

    // Update plot context before re-plotting
    updatePlotContextFromSelections();

    window.AppLoader.showLoading('Updating point size...');
    plotTransitionEditedGraphPointSize(plotDataUrl,displayElements);
    
});



//On Change Event listener for when the the line size radio button is selected.
lineSizeSelector.addEventListener('change', async () => {

    let plotDataUrl = await generatePlotDataQueryUrl();

    // Update plot context before re-plotting
    updatePlotContextFromSelections();

    window.AppLoader.showLoading('Updating line size...');
    plotTransitonEditedGraphLineSize(plotDataUrl,displayElements);
    
});



//Onclick event listener for modal close button.
plottingModalCloseButton.addEventListener("click", () => {

        hideAllPlotSelectorDescriptions(modalPlotSloDescriptionContainer, modalPlotMeasureDescriptionContainer);
        hideAllSelectorErrors(inputFields.sloSelector, inputFields.measureSelector, inputFields.startDateSelector, inputFields.endDateSelector);
        clearPlotModalSelectors(inputFields);
        closePlottingModal();

});



//Event listener that plots selected data.
plottingModalPlotButton.addEventListener('click', async () => {

    if (allPlottingInfoIsSelected(sloSelectorElement,measureSelectorElement,startDateSelectorElement,endDateSelectorElement)) {

        let plotDataUrl = await generatePlotDataQueryUrl();

        const currentSelectedSlo = sloSelectorElement.options[sloSelectorElement.selectedIndex].text;

        const currentSelectedMeasure = measureSelectorElement.options[measureSelectorElement.selectedIndex].text;


        // Update plot context before plotting
        updatePlotContextFromSelections();
        
        window.AppLoader.showLoading('Checking available targets...');
        
        axios.get(`https://class-assessment-data-visualizer.onrender.com/target/T2/exist/${currentSelectedSlo}/${currentSelectedMeasure}`).then((response) => {
            
            const hasBothTargets = response.data;

            console.log(`Has both targets: ${hasBothTargets} for : ${currentSelectedSlo} and ${currentSelectedMeasure}`);

            if (hasBothTargets) {//If the current selection has both target plot both.
                
                plotTransitionBothTargets(plotDataUrl,displayElements);

            }
            else {//Otherwise plot the single target.
                
                plotTransitionSingleTarget(plotDataUrl,displayElements);
                
            }
            
        });
       
    }
    else {//If all selectors are not selected then reveal the unselected errors for them.
        
        const unfilledSelectors = getAllUnslectedSelectors(inputFields);

        unfilledSelectors.forEach(revealUnselectedSelectorError);

    }

});

// Add keyboard support for the Plot button
plottingModalPlotButton.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        plottingModalPlotButton.click();
    }
});




// Initialize plot context display when page loads
document.addEventListener('DOMContentLoaded', () => {
    updatePlotContextDisplay();
});

// Function to reset plotting screen to home state
function resetPlottingScreen() {
    // Clear chart
    const chartContainer = document.getElementById('chart-div');
    if (chartContainer && chartContainer.children.length > 0) {
        chartContainer.innerHTML = '';
        chartContainer.style.display = 'none';
    }
    
    // Hide plot settings
    const plotSettingsContainer = document.getElementById('settings-container');
    if (plotSettingsContainer) {
        plotSettingsContainer.style.display = 'none';
    }
    
    // Show landing page
    const dashboardLogo = document.querySelector('.landing-page-wrapper');
    if (dashboardLogo) {
        dashboardLogo.style.display = 'flex';
    }
}

export {dashboardLogo,hideDashboardLogo,resetPlottingScreen};