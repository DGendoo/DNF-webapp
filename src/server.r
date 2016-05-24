library(rcytoscapejs)
library(shiny)

shinyServer(function(input, output) {
    id <- c("Jerry", "Elaine", "Kramer", "George")
    name <- id
    nodeData <- data.frame(id, name, stringsAsFactors=FALSE)
    
    source <- c("Jerry", "Jerry", "Jerry", "Elaine", "Elaine", "Kramer", "Kramer", "Kramer", "George")
    target <- c("Elaine", "Kramer", "George", "Jerry", "Kramer", "Jerry", "Elaine", "George", "Jerry")
    edgeData <- data.frame(source, target, stringsAsFactors=FALSE)
    #edgeData$sourceShape <-  
      
    output$plot <- renderRcytoscapejs({
      cyNetwork <- createCytoscapeJsNetwork(nodeData, edgeData)
      rcytoscapejs(nodeEntries=cyNetwork$nodes, edgeEntries=cyNetwork$edges, showPanzoom=FALSE)
    })
    
  }
)