library(rcytoscapejs)
library(shiny)


shinyUI(
  fluidPage(
    h1("DNF Network"),
    actionLink("saveImage", "Download as PNG"),
    rcytoscapejsOutput("plot", height="600px")
  )
  
)