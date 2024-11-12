// src/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Global Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: #ffffff;
    color: #333;
  }  
  .container{
    padding: 10px;
    /* Reduced padding around the content */
    margin: 0;
    /* Remove any extra margins */
  }
  
`;

export default GlobalStyle;
