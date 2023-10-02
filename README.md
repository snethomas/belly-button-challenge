# belly-button-challenge

### The dashboard is hosted at - https://snethomas.github.io/belly-button-challenge/

* Each section of code is commented with links used for reference/help.
* The "init" function uses the d3 library to pull data from the Amazon S3 bucket and stores it locally in a variable "responseData". It also initializes the page with the drop down values, two charts and the individual metadata
* The function "getDataByIndividual" is used by both the charts to get data in the required format ie., top 10 microbe sample values in the bar chart and all microbe sample values in the bubble chart
* The individual metadata was populated using function called "populateDemographicInfo"
* The bar chart for the top 10 microbes on selected individual was populated using function called "plotHorizontalBarGraph"
* The bubble chart for all microbes on selected individual was populated using function called "plotBubbleGraph"
* The "getData" function is used to change the charts and metadata based on the drop down value selected
