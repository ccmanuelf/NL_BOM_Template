<template>
  <div class="hero is-fullheight is-light">
    <div class="hero-body">
      <div class="container">
        <h1 class="title is-2 has-text-centered has-text-primary mb-6" style="margin-bottom: 1rem;">
          Novalink BOM Builder Template
        </h1>

        <!-- Top Section with BOM Master Data and Controls -->
        <div class="columns is-variable is-1" style="margin-bottom: 4px;">
          <!-- Vertical Datatable (BOM Master Data) -->
          <div class="column is-7" style="padding-bottom: 4px;">
            <div class="card mb-4 has-background-white-bis" style="margin-bottom: 4px;">
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
                <hot-table
                  ref="verticalTable"
                  :settings="verticalSettings"
                  @afterChange="afterVerticalChange"
                ></hot-table>
              </div>
            </div>
          </div>

          <!-- Controls Card -->
          <div class="column is-5">
            <div class="card mb-4 has-background-white-bis">
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
                <div class="field">
                  <label class="label is-small">BOM Status = {{ bomStatus }}</label>
                  <div class="level is-mobile mb-0">
                    <div class="level-left">
                      <div class="buttons are-small">
                        <button class="button is-primary is-outlined has-text-weight-semibold">
                          <span class="icon is-small">
                            <i class="fas fa-file-upload"></i>
                          </span>
                          <span>Load BOM</span>
                        </button>
                        <button class="button is-info is-outlined has-text-weight-semibold">
                          <span class="icon is-small">
                            <i class="fas fa-save"></i>
                          </span>
                          <span>Save BOM</span>
                        </button>
                      </div>
                    </div>
                    <div class="level-right">
                      <button class="button is-danger is-outlined is-small has-text-weight-semibold" @click="clearContents">
                        <span class="icon is-small">
                          <i class="fas fa-trash-alt"></i>
                        </span>
                        <span>Clear contents</span>
                      </button>
                    </div>
                  </div>
                </div>

                <hr class="has-background-grey-lighter my-4" />
                <h5 class="title is-6 has-text-centered mb-4">Revision History</h5>

                <hot-table
                  ref="revisionTable"
                  :settings="revisionSettings"
                  :rowHeaders="true"
                ></hot-table>
                <hr class="has-background-grey-lighter my-4" />
                <hot-table
                  ref="controlTable"
                  :settings="controlSettings"
                  :rowHeaders="false"
                ></hot-table>
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
              <button class="button is-success is-small is-outlined mr-1" @click="addRow">
                <span class="icon is-small">
                  <i class="fas fa-plus"></i>
                </span>
              </button>
              <button class="button is-danger is-small is-outlined" @click="removeRow">
                <span class="icon is-small">
                  <i class="fas fa-minus"></i>
                </span>
              </button>
            </div>
          </header>
          <div class="card-content p-0">
            <hot-table
              ref="horizontalTable"
              :settings="horizontalSettings"
              @afterChange="afterHorizontalChange"
            ></hot-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { HotTable } from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import Handsontable from 'handsontable'
import { getUserData, getBomContent, getBomStatus, validateBomData } from './services/api'

registerAllModules()

// Mock token for development
const authToken = ref('66|6VR9CUqvsAFoKue00nbfsjWAoC9CLNZ06b9XbL6e')
const userData = ref(null)
const validationErrors = ref([])

const verticalTable = ref(null)
const horizontalTable = ref(null)
const revisionTable = ref(null)
const controlTable = ref(null)
const bomStatus = ref('Draft')

// Initialize user data and BOM status
onMounted(async () => {
  try {
    // Get user data
    userData.value = await getUserData(authToken.value)
    
    // Get BOM status if product ID exists
    const productId = verticalData.value[0][1]
    if (productId) {
      const status = await getBomStatus(authToken.value, productId)
      bomStatus.value = status.status
    }
  } catch (error) {
    console.error('Error initializing data:', error)
  }
})

// Initial default states for tables
const defaultVerticalData = [
  ['Assembly Number', ''],
  ['Assembly Description', ''],
  ['Client Part Number', ''],
  ['Product Unit of Measure', ''],
  ['Set Definition', ''],
  ['Product Weight (lb)', '0.000'],
  ['Client\'s Rate (USD)', '0.000'],
  ['Product SAH (Hrs)', '0.000'],
  ['Assembly Revision', 'Calculated'],
  ['Part Count', '0'],
  ['Labor', '0.000'],
  ['Total Part Cost', '0.0000'],
  ['Grand Total', '0.0000']
]

const defaultHorizontalData = [
  ['', '', '', 0.0000, 0.0000, '', '', '', 0.0000, 0.0000, false, '']
]

const defaultRevisionData = [['Initial release', new Date().toLocaleString()]]

const defaultControlData = [[true, true]]

// Reactive data for tables
const verticalData = ref([
  ['Assembly Number', ''],
  ['Assembly Description', ''],
  ['Client Part Number', ''],
  ['Product Unit of Measure', ''],
  ['Set Definition', ''],
  ['Product Weight (lb)', '0.000'],
  ['Client\'s Rate (USD)', '0.000'],
  ['Product SAH (Hrs)', '0.000'],
  ['Assembly Revision', 'Calculated'],
  ['Part Count', '0'],
  ['Labor', '0.000'],
  ['Total Part Cost', '0.0000'],
  ['Grand Total', '0.0000']
])

const horizontalData = ref([
  ['', '', '', 0.0000, 0.0000, '', '', '', 0.0000, 0.0000, false, '']
])

const revisionData = ref([['Initial release', new Date().toLocaleString()]])

const controlData = ref([[true, true]])

// Settings for Handsontable
const verticalSettings = ref({
  data: verticalData.value,
  colHeaders: ['Field Name', 'Value'],
  rowHeaders: false,
  licenseKey: 'non-commercial-and-evaluation',
  stretchH: 'last',
  contextMenu: true,
  colWidths: [200, null],
  columns: [
    { data: 0, readOnly: true, className: 'htCenter htMiddle' },
    { data: 1, className: 'htCenter htMiddle' }
  ],
  afterGetColHeader: (col, TH) => {
    TH.className = 'htCenter htMiddle'
  }
})

const horizontalSettings = ref({
  data: horizontalData.value,
  colHeaders: [
    'Component Number',
    'Comments',
    'Component Description',
    'Product\nQty',
    'Process\nQty',
    'UofM\nUS',
    'Origin',
    'Consumed At',
    'Cost per\nUoM',
    'Total Cost',
    'Notes'
  ],
  rowHeaders: true,
  rowHeaderWidth: 30,
  licenseKey: 'non-commercial-and-evaluation',
  stretchH: 'all',
  contextMenu: true,
  height: 300,
  width: '100%',
  colWidths: [150, 100, 200, 60, 60, 40, 45, 80, 60, 60, 100],
  afterGetColHeader: (col, TH) => {
    const headerText = horizontalSettings.value.colHeaders[col] || ''
    if (headerText && headerText.includes('\n')) {
      TH.innerHTML = headerText.split('\n').map(line => `<div>${line}</div>`).join('')
      TH.style.whiteSpace = 'normal'
      TH.style.height = 'auto'
      TH.style.verticalAlign = 'middle'
    }
    TH.className = 'htCenter htMiddle'
  },
  columns: [
    { data: 0, type: 'text', className: 'htCenter htMiddle' },
    { data: 1, type: 'text', className: 'htCenter htMiddle' },
    { data: 2, type: 'text', wordWrap: true, className: 'htCenter htMiddle' },
    { data: 3, type: 'numeric', numericFormat: { pattern: '0.0000' }, className: 'htCenter htMiddle' },
    { data: 4, type: 'numeric', numericFormat: { pattern: '0.0000' }, className: 'htCenter htMiddle' },
    { data: 5, type: 'text', className: 'htCenter htMiddle' },
    { data: 6, type: 'text', className: 'htCenter htMiddle' },
    { data: 7, type: 'text', className: 'htCenter htMiddle' },
    { data: 8, type: 'numeric', numericFormat: { pattern: '0.0000' }, className: 'htCenter htMiddle' },
    { data: 9, type: 'numeric', readOnly: true, numericFormat: { pattern: '0.0000' }, className: 'htCenter htMiddle' },
    { data: 11, type: 'text', className: 'htCenter htMiddle' }
  ]
})

const revisionSettings = ref({
  data: revisionData.value,
  colHeaders: ['Changelog', 'Creation Date'],
  headerClassName: 'htCenter',
  rowHeaders: true,
  rowHeaderWidth: 20,
  licenseKey: 'non-commercial-and-evaluation',
  stretchH: 'all',
  contextMenu: true,
  columns: [
    { data: 0, type: 'text', wordWrap: true, className: 'htCenter htMiddle'  },
    { data: 1, type: 'text', readOnly: true, className: 'htCenter htMiddle'  }
  ]
})

const controlSettings = ref({
  data: controlData.value,
  colHeaders: ['Including Waste', 'Including Packaging'],
  headerClassName: 'htCenter',
  rowHeaders: false,
  licenseKey: 'non-commercial-and-evaluation',
  stretchH: 'all',
  contextMenu: true,
  columns: [
    { data: 0, type: 'checkbox', className: 'htCenter htMiddle'},
    { data: 1, type: 'checkbox', className: 'htCenter htMiddle'}
  ]
})

// Watch for changes in reactive data and sync with Handsontable
watch(verticalData, (newData) => {
  if (verticalTable.value?.hotInstance) {
    verticalTable.value.hotInstance.loadData(newData)
  }
}, { deep: true })

watch(horizontalData, (newData) => {
  if (horizontalTable.value?.hotInstance) {
    horizontalTable.value.hotInstance.loadData(newData)
  }
}, { deep: true })

watch(revisionData, (newData) => {
  if (revisionTable.value?.hotInstance) {
    revisionTable.value.hotInstance.loadData(newData)
  }
}, { deep: true })

watch(controlData, (newData) => {
  if (controlTable.value?.hotInstance) {
    controlTable.value.hotInstance.loadData(newData)
  }
}, { deep: true })

// Handle afterChange events
const afterVerticalChange = async (changes) => {
  if (!changes) return
  
  // Clear previous validation errors
  validationErrors.value = []
  
  changes.forEach(async ([row, prop, oldValue, newValue]) => {
    if (prop === 1 && row === 6) {
      // Recalculate Labor and Grand Total based on Weight
      const weight = parseFloat(newValue) || 0
      verticalData.value[7][1] = (weight * 0.5).toFixed(3)
      verticalData.value[9][1] = (
        parseFloat(verticalData.value[7][1]) +
        parseFloat(verticalData.value[8][1])
      ).toFixed(4)
    }
  })
}

const afterHorizontalChange = async (changes) => {
  if (!changes) return
  
  // Clear previous validation errors
  validationErrors.value = []
  
  changes.forEach(async ([row, prop, oldValue, newValue]) => {
    if (prop === 3 || prop === 4 || prop === 8 || prop === 10) {
      const productQty = parseFloat(horizontalData.value[row][3]) || 0
      const processQty = parseFloat(horizontalData.value[row][4]) || 0
      const costPerUoM = parseFloat(horizontalData.value[row][8]) || 0
      const includeWaste = horizontalData.value[row][10]
      const totalCost = includeWaste
        ? (productQty + processQty) * costPerUoM
        : productQty * costPerUoM
      horizontalData.value[row][9] = totalCost.toFixed(4)
    }
  })
}

// Add a new row to the horizontal table
const addRow = () => {
  const hotInstance = horizontalTable.value.hotInstance
  const selectedRows = hotInstance.getSelected()
  const emptyRow = ['', '', '', 0.0000, 0.0000, '', '', '', 0.0000, 0.0000, false, '']
  
  if (selectedRows && selectedRows[0]) {
    const [, startRow] = selectedRows[0]
    horizontalData.value.splice(startRow + 1, 0, emptyRow)
  } else {
    horizontalData.value.push(emptyRow)
  }
}

// Remove a row from the horizontal table
const removeRow = () => {
  const hotInstance = horizontalTable.value.hotInstance
  const selectedRows = hotInstance.getSelected()
  
  if (horizontalData.value.length === 1) {
    // If only one row exists, clear its contents
    horizontalData.value[0] = ['', '', '', 0.0000, 0.0000, '', '', '', 0.0000, 0.0000, false, '']
    return
  }
  
  if (selectedRows && selectedRows[0]) {
    const [, startRow] = selectedRows[0]
    horizontalData.value.splice(startRow, 1)
  } else {
    horizontalData.value.pop()
  }
}

// Clear contents with confirmation
const clearContents = async () => {
  if (confirm('Are you sure you want to clear all contents? This action cannot be undone.')) {
    // Clear validation errors
    validationErrors.value = []
    // Reset all tables to their default states
    verticalData.value = JSON.parse(JSON.stringify(defaultVerticalData))
    horizontalData.value = JSON.parse(JSON.stringify(defaultHorizontalData))
    revisionData.value = [['Initial release', new Date().toLocaleString()]]
    controlData.value = JSON.parse(JSON.stringify(defaultControlData))
  }
}
</script>

<style scoped>
/* Scoped styles to avoid conflicts */
.card-header {
  padding: 0.5rem;
}

.card-header-title {
  padding: 0.5rem;
}

.hot-table {
  border-radius: 6px;
}

.handsontable .htCore th {
  white-space: normal;
  height: auto;
  padding: 4px;
  vertical-align: middle;
}

.handsontable .htCore td {
  padding: 6px 8px;
}

.button:active {
  transform: scale(0.65);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
  transition: all 0.05s ease-in-out;
}
</style>