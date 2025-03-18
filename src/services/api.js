// API endpoints
const API_BASE_URL = 'https://v5.novalinkpix.com/api'

// Mock error responses
const mockErrors = {
  unauthorized: { error: 'Unauthorized access', code: 401 },
  notFound: { error: 'Resource not found', code: 404 },
  invalidData: { error: 'Invalid data provided', code: 400 },
  serverError: { error: 'Internal server error', code: 500 }
}

// Mock data for testing
const mockUserData = {
  user: {
    id: 58,
    name: 'Jose Rdz',
    email: 'jrdz@novalinkmx.com',
    username: '',
    company_id: 1033,
    is_admin: 0,
    employee_id: null,
    groups: [
      {
        name: 'assets.view',
        description: 'Can request pediment information'
      }
    ],
    companies: [
      {
        id: 151,
        name: 'PROLYESA',
        prefix: '',
        active: 1,
        parasql_id: 1
      }
    ]
  }
}

const mockBomContent = [
  {
    id: 112418,
    product_id: '3810-8000000',
    user: 'vvielma',
    invoice: 'PRO/0872',
    component: 'FRANK00007',
    description: 'DADO DE METAL PARA CORTAR TELA',
    um_us: 'IN',
    origin: 'US',
    comments: 'SIN MARCA',
    notes: 'SIN MODELO',
    consumed_at: 'N/A',
    unit_cost: 190,
    weight: 2.9,
    company_id: 54,
    company: 'FRANKLIN PRODUCTS'
  }
]

// Mock API functions with error handling
export const login = async (email, password, deviceName) => {
  if (!email || !password) {
    throw mockErrors.invalidData
  }
  
  // Simulate authentication check
  if (email === 'jrdz@novalinkmx.com' && password === 'test') {
    return {
      token: '66|6VR9CUqvsAFoKue00nbfsjWAoC9CLNZ06b9XbL6e',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  }
  
  throw mockErrors.unauthorized
}

export const getUserData = async (token) => {
  if (!token) throw mockErrors.unauthorized
  return mockUserData
}

export const getBomContent = async (token, productId) => {
  if (!token) throw mockErrors.unauthorized
  if (!productId) throw mockErrors.invalidData
  
  // Simulate BOM not found
  if (productId !== '3810-8000000') {
    throw mockErrors.notFound
  }
  
  return mockBomContent
}

export const getPartContent = async (token, part) => {
  if (!token) throw mockErrors.unauthorized
  if (!part) throw mockErrors.invalidData
  
  // Mock part data
  return {
    part_number: part,
    description: 'Sample Part',
    supplier: 'Sample Supplier',
    unit_cost: 100,
    lead_time: '2 weeks'
  }
}

export const getBomStatus = async (token, productId) => {
  if (!token) throw mockErrors.unauthorized
  if (!productId) throw mockErrors.invalidData
  
  // Mock different statuses
  const statuses = ['Draft', 'In Review', 'Approved', 'Rejected']
  return { 
    status: statuses[Math.floor(Math.random() * statuses.length)],
    last_updated: new Date().toISOString()
  }
}

export const getClientName = async (token, clientId) => {
  if (!token) throw mockErrors.unauthorized
  if (!clientId) throw mockErrors.invalidData
  
  return { 
    name: 'PROLYESA',
    id: clientId,
    contact: 'John Doe',
    email: 'contact@prolyesa.com'
  }
}

// Data validation functions
export const validateBomData = (data) => {
  const errors = []

  // Validate required fields
  if (!data.product_id) errors.push('Product ID is required')
  if (!data.component) errors.push('Component is required')
  if (!data.description) errors.push('Description is required')
  if (!data.um_us) errors.push('Unit of Measure is required')
  if (!data.origin) errors.push('Origin is required')

  // Validate numeric fields
  if (isNaN(data.unit_cost) || data.unit_cost < 0) {
    errors.push('Unit cost must be a positive number')
  }
  if (isNaN(data.weight) || data.weight < 0) {
    errors.push('Weight must be a positive number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}