
import { TemplateId, Tone, type CustomizationParams, type Template } from './types';

export const PROMPT_TEMPLATES: Template[] = [
  {
    id: TemplateId.API_ENDPOINT,
    name: 'API Endpoint Docs',
    description: 'Generate comprehensive documentation for a single REST API endpoint, including request, response, and examples.',
    placeholder: 'e.g.,\nGET /users/{id}\n\nQuery Params:\n- include_details (boolean, optional): Include full user details.\n\nSuccess Response (200 OK):\n{\n  "id": "user-123",\n  "name": "Jane Doe",\n  "email": "jane.doe@example.com"\n}',
    prompt: (input: string, params: CustomizationParams) => `
      Generate technical documentation for the following API endpoint.
      The documentation should be written in a ${params.tone} tone.
      Assume the target audience for this documentation is developers working with ${params.language}.
      The total length of the generated documentation should be approximately ${params.maxLength} words.

      The documentation must include the following sections:
      1.  **Endpoint**: The HTTP method and URL.
      2.  **Description**: A brief summary of what the endpoint does.
      3.  **Parameters**: Path, query, and body parameters, including their type and if they are required.
      4.  **Success Response**: A description of a successful response, with a status code and example JSON body.
      5.  **Error Responses**: Descriptions of potential error responses (e.g., 404 Not Found, 401 Unauthorized).
      6.  **Example Usage**: A code snippet showing how to call this endpoint.

      **API Endpoint Details:**
      \`\`\`
      ${input}
      \`\`\`
    `,
  },
  {
    id: TemplateId.FUNCTION_DOCSTRING,
    name: 'Function Docstring',
    description: 'Create a detailed docstring for a code function, explaining its purpose, parameters, and return value.',
    placeholder: 'e.g.,\n\nfunction calculateFactorial(n) {\n  if (n < 0) return -1;\n  if (n === 0) return 1;\n  return n * calculateFactorial(n - 1);\n}',
    prompt: (input: string, params: CustomizationParams) => `
      Generate a comprehensive docstring for the following function written in ${params.language}.
      The docstring should be in a ${params.tone} tone and formatted according to standard conventions for ${params.language} (e.g., JSDoc for JavaScript, PEP 257 for Python).
      The total length should be around ${params.maxLength} words.

      The docstring must include:
      1.  A one-line summary of the function's purpose.
      2.  A more detailed explanation of its behavior.
      3.  Descriptions for each parameter (@param), including its type and purpose.
      4.  A description of the return value (@returns), including its type.
      5.  Any exceptions or errors it might throw (@throws).

      **Function Code:**
      \`\`\`${params.language}
      ${input}
      \`\`\`
    `,
  },
  {
    id: TemplateId.README_SECTION,
    name: 'README.md Section',
    description: 'Generate a specific section for a project\'s README file, such as "Installation" or "Usage".',
    placeholder: 'Section Title: Installation\n\nProject Details:\n- Node.js project\n- Package manager: npm\n- Main dependency: express\n- Run command: npm start',
    prompt: (input: string, params: CustomizationParams) => `
      Generate a well-formatted Markdown section for a project's README.md file.
      The tone should be ${params.tone} and clear for developers.
      The programming language context is ${params.language}.
      The section should be approximately ${params.maxLength} words.

      Based on the details provided, create a complete and easy-to-follow section. Use code blocks for commands and filenames.

      **Details for README Section:**
      ${input}
    `,
  },
  {
    id: TemplateId.CODE_EXPLAINER,
    name: 'Code Explainer',
    description: 'Explain a block of code in plain English, breaking down its logic and functionality step by step.',
    placeholder: 'e.g.,\n\nconst memoize = (fn) => {\n  const cache = {};\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (key in cache) {\n      return cache[key];\n    }\n    const result = fn(...args);\n    cache[key] = result;\n    return result;\n  };\n};',
    prompt: (input: string, params: CustomizationParams) => `
      Explain the following block of ${params.language} code step-by-step.
      The explanation should be ${params.tone} and targeted at someone who is a ${params.tone === Tone.BEGINNER_FRIENDLY ? 'novice' : 'developer'}.
      Provide a high-level summary first, then a detailed breakdown of the logic.
      The explanation should be roughly ${params.maxLength} words.

      **Code to Explain:**
      \`\`\`${params.language}
      ${input}
      \`\`\`
    `,
  },
  {
    id: TemplateId.ARCHITECTURE_OVERVIEW,
    name: 'Architecture Overview',
    description: 'Generate a high-level description of a system\'s architecture based on its key components and their interactions.',
    placeholder: 'Components:\n- React Frontend (UI)\n- Node.js/Express Backend (API Gateway)\n- PostgreSQL Database (Data Storage)\n- Redis (Caching)\n\nInteractions:\n- Frontend calls Backend API for data.\n- Backend queries PostgreSQL for primary data and Redis for cached data.\n- All services are containerized with Docker.',
    prompt: (input: string, params: CustomizationParams) => `
      Generate a high-level technical architecture overview based on the provided components and their interactions.
      The overview should be written in a ${params.tone} tone and be about ${params.maxLength} words.
      The primary technology stack mentioned is ${params.language}, but describe all components.

      The document should cover:
      1.  **Introduction**: A brief summary of the system's purpose.
      2.  **Component Breakdown**: A description of each component and its role.
      3.  **Data Flow**: An explanation of how data moves through the system during a typical user interaction.
      4.  **Key Technologies**: A summary of the technologies used.

      **System Components and Interactions:**
      ${input}
    `,
  },
];
