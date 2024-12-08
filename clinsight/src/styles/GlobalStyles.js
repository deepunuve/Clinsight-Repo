// src/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Global Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body, html, .container, .row, .col, .btn, .navbar-brand, .card-title {
    font-family: 'Brava Sans', sans-serif !important;
  }
  
  body {
    font-family: 'Brava Sans', sans-serif !important;
    font-weight: 100; /* Light weight */
    letter-spacing: 0.05em; /* Adjust spacing as needed */
    margin: 0;
    padding: 0;
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
