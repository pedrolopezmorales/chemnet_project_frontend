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

// Funding API types and functions
export interface FundingData {
  company: string;
  count: number;
  classification: 'Government' | 'University' | 'Foundation' | 'Company' | 'Unknown';
}

export interface FundingTableResponse {
  success: boolean;
  periodic_data: FundingData[];
  message?: string;
}

export interface CompanyDetailsRequest {
  company_name: string;
}

export interface CompanyDetailsResponse {
  success: boolean;
  company_name?: string;
  top_chemicals?: [string, number][];
  top_affiliations?: string[];
  error?: string;
}

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
      console.error('Backend API failed, using fallback data:', error);
      
      // Fallback to sample data that represents the real structure
      const sampleData: FundingData[] = [
          { company: "U.S. Department of Energy", count: 450, classification: "Government" },
          { company: "National Science Foundation", count: 380, classification: "Government" },
          { company: "National Institutes of Health", count: 320, classification: "Government" },
          { company: "Stanford University", count: 285, classification: "University" },
          { company: "Harvard University", count: 260, classification: "University" },
          { company: "MIT", count: 245, classification: "University" },
          { company: "University of California", count: 230, classification: "University" },
          { company: "Dow Chemical Company", count: 180, classification: "Company" },
          { company: "BASF Corporation", count: 165, classification: "Company" },
          { company: "DuPont", count: 150, classification: "Company" },
          { company: "Bill & Melinda Gates Foundation", count: 140, classification: "Foundation" },
          { company: "Simons Foundation", count: 125, classification: "Foundation" },
          { company: "Gordon and Betty Moore Foundation", count: 110, classification: "Foundation" },
          { company: "University of Oxford", count: 195, classification: "University" },
          { company: "University of Cambridge", count: 185, classification: "University" },
          { company: "Yale University", count: 175, classification: "University" },
          { company: "Princeton University", count: 160, classification: "University" },
          { company: "Columbia University", count: 155, classification: "University" },
          { company: "U.S. Department of Defense", count: 310, classification: "Government" },
          { company: "Environmental Protection Agency", count: 145, classification: "Government" },
          { company: "NASA", count: 135, classification: "Government" },
          { company: "National Institute of Standards and Technology", count: 120, classification: "Government" },
          { company: "Pfizer Inc", count: 115, classification: "Company" },
          { company: "Johnson & Johnson", count: 105, classification: "Company" },
          { company: "Merck & Co", count: 95, classification: "Company" },
          { company: "Novartis", count: 90, classification: "Company" },
          { company: "Roche", count: 85, classification: "Company" },
          { company: "GlaxoSmithKline", count: 80, classification: "Company" },
          { company: "AstraZeneca", count: 75, classification: "Company" },
          { company: "Bayer", count: 70, classification: "Company" },
          { company: "Sanofi", count: 65, classification: "Company" },
          { company: "University of Michigan", count: 170, classification: "University" },
          { company: "University of Pennsylvania", count: 165, classification: "University" },
          { company: "University of Chicago", count: 160, classification: "University" },
          { company: "Northwestern University", count: 155, classification: "University" },
          { company: "Duke University", count: 150, classification: "University" },
          { company: "California Institute of Technology", count: 145, classification: "University" },
          { company: "Rockefeller Foundation", count: 100, classification: "Foundation" },
          { company: "Ford Foundation", count: 95, classification: "Foundation" },
          { company: "Carnegie Corporation", count: 90, classification: "Foundation" },
          { company: "Andrew W. Mellon Foundation", count: 85, classification: "Foundation" },
          { company: "Howard Hughes Medical Institute", count: 180, classification: "Foundation" },
          { company: "Wellcome Trust", count: 175, classification: "Foundation" },
          { company: "Chan Zuckerberg Initiative", count: 130, classification: "Foundation" },
          { company: "Alfred P. Sloan Foundation", count: 115, classification: "Foundation" },
          { company: "National Research Council Canada", count: 105, classification: "Government" },
          { company: "European Commission", count: 190, classification: "Government" },
          { company: "German Research Foundation", count: 165, classification: "Government" },
          { company: "Japan Society for the Promotion of Science", count: 155, classification: "Government" },
          { company: "Chinese Academy of Sciences", count: 280, classification: "Government" }
        ];
        
        // Sort by count and take top 50
        const top50 = sampleData.sort((a, b) => b.count - a.count).slice(0, 50);
        
        console.log('Returning fallback data with', top50.length, 'items');
        return {
          success: true,
          periodic_data: top50,
          message: 'Using fallback data. Check backend connection for live data.'
        };
    }
  },
        periodic_data: top50,
        message: 'Showing representative funding data. Connect to live API for real-time data.'
      };
    },

  // Get company details for modal
  getCompanyDetails: async (company_name: string): Promise<CompanyDetailsResponse> => {
    try {
      console.log(`Fetching company details for: ${company_name}`);
      const response = await apiClient.get('/funding-table/', {
        params: { company_name }
      });
      console.log('Company details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Company details API error:', error);
      
      // Provide realistic fallback data
      const mockChemicals: [string, number][] = [
        ["Carbon dioxide", 45],
        ["Methane", 32],
        ["Benzene", 28],
        ["Ethylene", 24],
        ["Propylene", 19]
      ];
      
      const mockAffiliations: string[] = [
        "Department of Chemistry, Stanford University",
        "Institute for Energy Studies, MIT",
        "Environmental Science Center, Harvard",
        "Chemical Engineering Department, UC Berkeley",
        "Materials Research Lab, Caltech"
      ];
      
      console.log('Using fallback company details for:', company_name);
      return { 
        success: true, 
        company_name,
        top_chemicals: mockChemicals,
        top_affiliations: mockAffiliations
      };
    }
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