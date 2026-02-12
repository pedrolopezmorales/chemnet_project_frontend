import axios from 'axios';

// Base URL for Django API - uses environment variable for production
const API_BASE_URL = `https://dabrahamsson.pythonanywhere.com/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000000, //  timeout
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
  description?: string;
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
  description?:  {
    title: string;
    description: string;
    url: string;
    thumbnail?: string;
  } | null;
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
  example_researchers?: string[];
  all_researcher_names?: string[];
  needs_selection?: boolean;
  matches?: ResearcherMatch[];
}

export interface ResearcherMatch {
  Researcher: string;
  Affiliation: string;
  Country: string;
  Department?: string;
  Companies?: any[];
}

export interface FundingData {
  company: string;
  count: number;
  classification: string;
}

export interface FundingTableResponse {
  success: boolean;
  funding_data?: FundingData[];
  message?: string;
}

export interface CompanyDetailsResponse {
  success: boolean;
  company_name?: string;
  top_chemicals?: [string, number][];
  top_affiliations?: string[];
  error?: string;
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

export const fundingApi = {
  // Get funding table data
  getFundingTable: async (): Promise<FundingTableResponse> => {
    console.log('getFundingTable called');
    
    try {
      console.log('Calling backend API for funding table...');
      const response = await apiClient.get('/funding-table/');
      console.log('Backend response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Backend API failed:', error);
      return {
        success: false,
        message: 'Failed to load funding data'
      };
    }
  },

  // Get company details for modal
  getCompanyDetails: async (company_name: string): Promise<CompanyDetailsResponse> => {
    try {
      console.log(`Fetching company details for: ${company_name}`);
      const response = await apiClient.get(`/funding-table/?company_name=${encodeURIComponent(company_name)}`);
      console.log('Company details response:', response.data);
      
      if (response.data.success) {
        return {
          success: true,
          company_name: response.data.company_name,
          top_chemicals: response.data.top_chemicals,
          top_affiliations: response.data.top_affiliations
        };
      }
      
      return {
        success: false,
        error: 'No data found for company'
      };
    } catch (error) {
      console.error('Company details API error:', error);
      return {
        success: false,
        error: 'Failed to load company details'
      };
    }
  },
};

// Error handling wrapper
export const handleApiError = (error: any) => {
  console.error('Full error object:', error);
  
  if (error.response) {
    return {
      success: false,
      message: error.response.data?.message || `Server error: ${error.response.status}`,
      error: 'SERVER_ERROR'
    };
  } else if (error.request) {
    return {
      success: false,
      message: 'Unable to connect to the backend server.',
      error: 'NETWORK_ERROR'
    };
  } else {
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: 'UNKNOWN_ERROR'
    };
  }
};
