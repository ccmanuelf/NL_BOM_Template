<template>
  <div class="hero is-fullheight is-light">
    <div class="hero-body">
      <div class="container">
        <h1 class="title is-2 has-text-centered has-text-primary mb-6">Novalink BOM Builder Template</h1>
        
        <!-- Top Section with BOM Master Data and Controls -->
        <div class="columns">
          <!-- Vertical Datatable (BOM Master Data) -->
          <div class="column is-7"> <!-- Using ~58% of screen width (7/12 columns) -->
            <div class="card mb-1 has-background-white-bis">
              <header class="card-header has-background-primary-light">
                <p class="card-header-title is-centered">
                  <span class="icon-text">
                    <span class="icon has-text-primary">
                      <i class="fas fa-list"></i>
                    </span>
                    <span>BOM Master Data</span>
                  </span>
                </p>
              </header>
              <div class="card-content p-0">
                <div class="box p-0 m-0 has-shadow">
                  <hot-table ref="verticalTable" :settings="verticalSettings" @afterChange="afterVerticalChange" data-id="vertical-table"></hot-table>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Controls Card -->
          <div class="column is-5"> <!-- Using ~42% of screen width (5/12 columns) -->
            <div class="card mb-1 has-background-white-bis">
              <header class="card-header has-background-primary-light">
                <p class="card-header-title is-centered">
                  <span class="icon-text">
                    <span class="icon has-text-primary">
                      <i class="fas fa-cogs"></i>
                    </span>
                    <span>Controls</span>
                  </span>
                </p>
              </header>
              <div class="card-content p-2">
                <div class="box p-2 m-0 has-shadow">
                  <!-- Control elements will go here -->
                  <div class="field">
                    <label class="label is-small">Import/Export</label>
                    <div class="level is-mobile mb-0">
                      <div class="level-left">
                        <div class="buttons are-small">
                          <button class="button is-primary is-outlined is-focused">
                            <span class="icon is-small">
                              <i class="fas fa-file-upload"></i>
                            </span>
                            <span>Load BOM</span>
                          </button>
                          <button class="button is-info is-outlined is-focused">
                            <span class="icon is-small">
                              <i class="fas fa-save"></i>
                            </span>
                            <span>Save BOM</span>
                          </button>
                        </div>
                      </div>
                      <div class="level-right">
                        <button class="button is-warning is-outlined is-focused is-small">
                          <span class="icon is-small">
                            <i class="fas fa-trash-alt"></i>
                          </span>
                          <span>Clear contents</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr class="has-background-grey-lighter my-4">
                  <h5 class="title is-5 has-text-centered mb-4">Revision History</h5>

                  <div class="box p-0 m-0 has-shadow">
                    <hot-table ref="revisionTable" :settings="revisionSettings" data-id="revision-table" :rowHeaders="true"></hot-table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Horizontal Datatable -->
        <div class="card has-background-white-bis">
          <header class="card-header has-background-primary-light">
            <p class="card-header-title is-centered">
              <span class="icon-text">
                <span class="icon has-text-primary">
                  <i class="fas fa-table"></i>
                </span>
                <span>BOM Contents Definition</span>
              </span>
            </p>
            <div class="card-header-icons">
              <button class="button is-success is-small is-outlined mr-1">
                <span class="icon is-small">
                  <i class="fas fa-plus"></i>
                </span>
              </button>
              <button class="button is-danger is-small is-outlined">
                <span class="icon is-small">
                  <i class="fas fa-minus"></i>
                </span>
              </button>
            </div>
          </header>
          <div class="card-content p-0">
            <div class="box p-0 m-0 has-shadow">
              <hot-table ref="horizontalTable" :settings="horizontalSettings" @afterChange="afterHorizontalChange" data-id="horizontal-table"></hot-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { registerAllModules } from 'handsontable/registry'
import { HotTable } from '@handsontable/vue3'
// Import order matters for CSS priority:
// 1. Bulma (base framework)
// 2. Handsontable (component-specific styles)
// 3. Custom styles (overrides)
import 'bulma/css/bulma.min.css'
import 'handsontable/dist/handsontable.full.min.css'
import './App.css'
import './custom-spacing.css'

// Register all Handsontable modules
registerAllModules()

// Import specific modules we need to ensure they're available
import { CopyPaste } from 'handsontable/plugins'
import Handsontable from 'handsontable'

// Template refs
const verticalTable = ref(null)
const horizontalTable = ref(null)
const revisionTable = ref(null)

// Data for vertical table
const verticalData = ref([
  ['Assembly Number', ''],
  ['Assembly Description', ''],
  ['Client Part Number', ''],
  ['Assembly Revision', 'Calculated'],
  ['Creation Date', new Date().toLocaleString()],
  ['Part Count', '0'],
  ['Weight (lb)', '0.000'],
  ['Labor', '0.000'],
  ['Total Part Cost', '0.0000'],
  ['Grand Total', '0.0000']
])

// Column headers for vertical table
const verticalHeaders = ref(['Field Name', 'Value'])

// Configure header settings for vertical table
const verticalHeaderSettings = {
  className: 'htCenter htMiddle',
  height: 10 // Ensure consistent header height
}

// Data for horizontal table
const horizontalData = ref([
  ['', '', '', 0.0000, 0.0000, '', '', '', 0.0000, 0.0000, false, '']
])

// Data for revision history table
const revisionData = ref([
  ['Initial release', new Date().toLocaleString()]
])

// Column headers for revision history table
const revisionHeaders = ref(['Changelog', 'Creation Date'])

// Column headers for horizontal table
const horizontalHeaders = ref([
  'Component Number', 'Comments', 'Component Description', 'Product\nQty', 'Process\nQty', 
  'UofM US', 'Origin', 'Consumed At', 'Cost per\nUoM', 'Total Cost', 'Including\nWaste', 'Notes'
])

// Handsontable settings for revision history table
const revisionSettings = ref({
  data: revisionData.value,
  colHeaders: revisionHeaders.value,
  rowHeaders: false,
  height: 'auto',
  width: '100%',
  licenseKey: 'non-commercial-and-evaluation',
  stretchH: 'all',
  contextMenu: true,
  colWidths: [300, 200],
  copyPaste: true,
  theme: 'ht-theme-main',
  columns: [
    {
      // Changelog column
      type: 'text',
      wordWrap: true,
      className: 'htCenter'
    },
    {
      // Creation Date column
      type: 'text',
      readOnly: true,
      className: 'htCenter'
    }
  ]
})

// Handsontable settings
const verticalSettings = ref({
  data: verticalData.value,
  colHeaders: verticalHeaders.value,
  rowHeaders: false,
  height: 'auto',
  width: '100%',
  licenseKey: 'non-commercial-and-evaluation',
  stretchH: 'all',
  contextMenu: true,
  colWidths: [120, 380],
  copyPaste: true,
  theme: 'ht-theme-main',
  rowHeights: 10,
  afterGetColHeader: (col, TH) => {
    TH.className = 'htCenter htMiddle';
  },
  cells(row, col) {
    const cellProperties = {};
    // Set center alignment for both columns
    cellProperties.className = 'htCenter htMiddle';
    
    if (col === 0) {
      cellProperties.readOnly = true;
      cellProperties.className += ' has-text-weight-semibold';
    } else if (col === 1) {
      // Apply specific formatting based on the row (field type)
      switch(row) {
        case 0: // Assembly Number (varchar 100)
        case 2: // Client Part Number (varchar 100)
          cellProperties.type = 'text';
          cellProperties.editor = 'text';
          cellProperties.className = 'htCenter htMiddle';
          cellProperties.renderer = 'text';
          break;
        case 1: // Assembly Description (varchar 255 word wrap at 60 characters)
          cellProperties.type = 'text';
          cellProperties.wordWrap = true;
          break;
        case 3: // Assembly Revision (calculated)
          cellProperties.type = 'text';
          cellProperties.readOnly = true;
          break;
        case 4: // Creation Date (timestamp)
          cellProperties.type = 'date';
          cellProperties.readOnly = true;
          break;
        case 5: // Part Count (int calculated)
          cellProperties.type = 'numeric';
          cellProperties.readOnly = true;
          cellProperties.numericFormat = {
            pattern: '0',
            culture: 'en-US'
          };
          break;
        case 6: // Weight (lb) (float 3 decimal)
          cellProperties.type = 'numeric';
          cellProperties.numericFormat = {
            pattern: '0.000',
            culture: 'en-US'
          };
          break;
        case 7: // Labor (float 3 decimal - calculated)
          cellProperties.type = 'numeric';
          cellProperties.readOnly = true;
          cellProperties.numericFormat = {
            pattern: '0.000',
            culture: 'en-US'
          };
          break;
        case 8: // Total Part Cost (float 4 decimal - calculated)
        case 9: // Grand Total (float 4 decimal - calculated)
          cellProperties.type = 'numeric';
          cellProperties.readOnly = true;
          cellProperties.numericFormat = {
            pattern: '0.0000',
            culture: 'en-US'
          };
          break;
      }
    }
    return cellProperties;
  }
});

const horizontalSettings = ref({
  data: horizontalData.value,
  colHeaders: horizontalHeaders.value,
  rowHeaders: true,
  height: 'auto',
  width: '100%',
  licenseKey: 'non-commercial-and-evaluation',
  stretchH: 'none',
  contextMenu: true,
  copyPaste: true,
  theme: 'ht-theme-main',
  colWidths: horizontalHeaders.value.map((header, index) => {
    // Assign appropriate widths based on column content type
    switch(index) {
      case 0: return 150; // Component Number
      case 1: return 100; // Comments
      case 2: return 170; // Component Description
      case 3: return 80;  // Product Qty
      case 4: return 80;  // Process Qty
      case 5: return 70;  // UofM US
      case 6: return 70;  // Origin
      case 7: return 110; // Consumed At
      case 8: return 80;  // Cost per UoM
      case 9: return 90;  // Total Cost
      case 10: return 90; // Including Waste
      case 11: return 100; // Notes
      default: return 100; // Default width for any additional columns
    }
  }),
  // Custom header renderer to properly display line breaks in column headers
  afterGetColHeader: function(col, TH) {
    const headerText = horizontalHeaders.value[col];
    
    if (headerText && headerText.includes('\n')) {
      // Replace the header content with HTML that preserves line breaks
      const headerLines = headerText.split('\n');
      TH.innerHTML = headerLines.map(line => `<div>${line}</div>`).join('');
      TH.style.whiteSpace = 'normal';
      TH.style.height = 'auto';
      TH.style.verticalAlign = 'middle';
      TH.style.padding = '1px';
    }
  },
  cells(row, col) {
    const cellProperties = {};
    
    // Apply specific formatting based on the column type
    switch(col) {
      case 0: // Component Number (varchar 100)
      case 1: // Comments (varchar 100)
        cellProperties.type = 'text';
        break;
      case 2: // Component Description (varchar 150 word wrap)
        cellProperties.type = 'text';
        cellProperties.className = 'htLeft';
        cellProperties.wordWrap = true;
        break;
      case 3: // Product Qty (float 4 decimal resolution)
      case 4: // Process Qty (float 4 decimal resolution)
      case 8: // Cost per UoM (float 4 decimal resolution)
        cellProperties.type = 'numeric';
        cellProperties.numericFormat = {
          pattern: '0.0000',
          culture: 'en-US'
        };
        break;
      case 5: // UofM US (varchar 5)
      case 6: // Origin (varchar 5)
        cellProperties.type = 'text';
        break;
      case 7: // Consumed At (varchar 30)
        cellProperties.type = 'text';
        break;
      case 9: // Total Cost (calculated)
        cellProperties.type = 'numeric';
        cellProperties.readOnly = true;
        cellProperties.numericFormat = {
          pattern: '0.0000',
          culture: 'en-US'
        };
        break;
      case 10: // Including Waste (boolean check box)
        cellProperties.type = 'checkbox';
        break;
      case 11: // Notes (varchar 50)
        cellProperties.type = 'text';
        cellProperties.className = 'htLeft';
        break;
    }
    return cellProperties;
  }
});

// Handle afterChange event for vertical table
const afterVerticalChange = (changes) => {
  if (!changes) return;
  
  // Get the Handsontable instance
  const hot = verticalTable.value.hotInstance;
  if (!hot) return;
  
  // Update calculated fields based on changes
  // For now, we're just setting placeholder calculations
  // In a real application, these would be based on actual data
  
  // Assembly Revision - placeholder calculation
  hot.setDataAtCell(3, 1, 'Rev A');
  
  // Update timestamp if needed
  hot.setDataAtCell(4, 1, new Date().toLocaleString());
  
  // Part Count - placeholder calculation
  hot.setDataAtCell(5, 1, 5);
  
  // Labor - placeholder calculation based on weight
  const weight = parseFloat(hot.getDataAtCell(6, 1)) || 0;
  hot.setDataAtCell(7, 1, (weight * 0.5).toFixed(3));
  
  // Total Part Cost - placeholder calculation
  hot.setDataAtCell(8, 1, (weight * 10).toFixed(4));
  
  // Grand Total - placeholder calculation
  const labor = parseFloat(hot.getDataAtCell(7, 1)) || 0;
  const partCost = parseFloat(hot.getDataAtCell(8, 1)) || 0;
  hot.setDataAtCell(9, 1, (labor + partCost).toFixed(4));
};

// Handle afterChange event for horizontal table
const afterHorizontalChange = (changes) => {
  if (!changes) return;
  
  // Get the Handsontable instance
  const hot = horizontalTable.value.hotInstance;
  if (!hot) return;
  
  // Process each change
  changes.forEach(([row, prop, oldValue, newValue]) => {
    // Calculate Total Cost based on the formula:
    // [Product Qty + Process Qty] x Cost per UoM if Including Waste is checked
    // otherwise Product Qty x Cost per UoM
    
    // Get current values
    const productQty = parseFloat(hot.getDataAtCell(row, 3)) || 0;
    const processQty = parseFloat(hot.getDataAtCell(row, 4)) || 0;
    const costPerUoM = parseFloat(hot.getDataAtCell(row, 8)) || 0;
    const includeWaste = hot.getDataAtCell(row, 10);
    
    // Calculate total cost based on the formula
    let totalCost;
    if (includeWaste) {
      totalCost = (productQty + processQty) * costPerUoM;
    } else {
      totalCost = productQty * costPerUoM;
    }
    
    // Update the Total Cost cell
    hot.setDataAtCell(row, 9, totalCost.toFixed(4));
  });
};

onMounted(() => {
  // Handsontable is initialized via the component in the template
  // No custom DOM manipulation needed - using default ht-theme-main styling
})
</script>

<style>
/* All styles have been moved to App.css */
</style>