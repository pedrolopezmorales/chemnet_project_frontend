import axios from 'axios';

// Base URL for Django API - uses environment variable for production
const API_BASE_URL = `https://dabrahamsson.pythonanywhere.com/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000000, // ?? second timeout
});

// Types for API responses
export interface ChemicalSearchRequest {
  chemical?: string;
  inchikey?: string;
}

export interface ChemicalSearchResponse {
  success: boolean;
  chemical?: string;
  inchikey?: string;
  iframe_url?: string;
  connections?: Record<string, any>;
  suggestions?: string[];
  message?: string;
  example_chemicals?: Array<{name: string; inchikey: string}>;
  all_chemical_names?: string[];
}

export interface CompanySearchRequest {
  company: string;
  category?: 'Affiliations' | 'Chemicals' | 'Researchers' | 'Universities';
  chemical_group?: 'All' | 'Organic';
  sep_country?: boolean;
}

export interface CompanySearchResponse {
  success: boolean;
  company?: string;
  iframe_url?: string;
  connections?: Record<string, any>;
  suggestions?: string[];
  message?: string;
  example_companies?: string[];
  all_company_names?: string[];
  category_options?: string[];
  chemical_group_options?: string[];
}

export interface UniversitySearchRequest {
  university: string;
  category?: 'Chemicals' | 'Funding Sources';
  chemical_group?: 'All' | 'Organic';
}

export interface UniversitySearchResponse {
  success: boolean;
  university?: string;
  iframe_url?: string;
  connections?: Record<string, any>;
  suggestions?: string[];
  message?: string;
  example_universities?: string[];
  all_university_names?: string[];
  category_options?: string[];
  chemical_group_options?: string[];
}

export interface ResearcherSearchRequest {
  researcher: string;
  selected_index?: number;
  combine?: boolean;
}

export interface ResearcherSearchResponse {
  success: boolean;
  researcher?: string;
  iframe_url?: string;
  connections?: Record<string, any>;
  suggestions?: string[];
  message?: string;
  matches?: any[];
  needs_selection?: boolean;
  example_researchers?: string[];
  all_researcher_names?: string[];
}

// API functions
export const chemicalApi = {
  // Get example chemicals and all chemical names
  getChemicalData: async (): Promise<ChemicalSearchResponse> => {
    const response = await apiClient.get('/chemicals/');
    return response.data;
  },

  // Search for a chemical
  searchChemical: async (data: ChemicalSearchRequest): Promise<ChemicalSearchResponse> => {
    const response = await apiClient.post('/chemicals/', data);
    return response.data;
  },
};

export const companyApi = {
  // Get example companies and options
  getCompanyData: async (): Promise<CompanySearchResponse> => {
    const response = await apiClient.get('/companies/');
    return response.data;
  },

  // Search for a company
  searchCompany: async (data: CompanySearchRequest): Promise<CompanySearchResponse> => {
    const response = await apiClient.post('/companies/', data);
    return response.data;
  },
};

export const universityApi = {
  // Get example universities and options
  getUniversityData: async (): Promise<UniversitySearchResponse> => {
    const response = await apiClient.get('/universities/');
    return response.data;
  },

  // Search for a university
  searchUniversity: async (data: UniversitySearchRequest): Promise<UniversitySearchResponse> => {
    const response = await apiClient.post('/universities/', data);
    return response.data;
  },
};

export const researcherApi = {
  // Get example researchers and all researcher names
  getResearcherData: async (): Promise<ResearcherSearchResponse> => {
    const response = await apiClient.get('/researchers/');
    return response.data;
  },

  // Search for a researcher
  searchResearcher: async (data: ResearcherSearchRequest): Promise<ResearcherSearchResponse> => {
    const response = await apiClient.post('/researchers/', data);
    return response.data;
  },
};

// Error handling wrapper
export const handleApiError = (error: any) => {
  console.error('Full error object:', error);
  
  if (error.response) {
    // Server responded with error status
    console.error('API Error Response:', error.response.data);
    console.error('Status:', error.response.status);
    console.error('Headers:', error.response.headers);
    
    // If we get HTML instead of JSON, it means the endpoint is not an API
    if (error.response.headers['content-type']?.includes('text/html')) {
      return { 
        success: false, 
        message: `The backend endpoint returned HTML instead of JSON. This suggests the Django backend is not configured as a REST API. Status: ${error.response.status}` 
      };
    }
    
    return error.response.data;
  } else if (error.request) {
    // Request was made but no response received
    console.error('Network Error - No response received:', error.request);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return { 
      success: false, 
      message: `Network error: ${error.message}. Please check if the API server at ${API_BASE_URL} is accessible.` 
    };
  } else {
    // Something else happened
    console.error('Error:', error.message);
    return { success: false, message: 'An unexpected error occurred: ' + error.message };
  }
};