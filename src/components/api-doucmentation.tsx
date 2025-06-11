"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Code, Book } from "lucide-react"

interface ApiEndpoint {
  method: string
  name: string
  url: string
  description: string
  requestBody?: any
  queryParams?: any[]
  responseExample: any
  codeExamples: {
    javascript: string
    curl: string
    python: string
  }
}

interface ApiDocumentationProps {
  contentTypeId: string
  contentTypeName: string
}

export function ApiDocumentation({ contentTypeId, contentTypeName }: ApiDocumentationProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<{ [key: string]: string }>({})
  const api = process.env.NEXT_PUBLIC_API_URL || "https://your-api.com";
  // Comprehensive API endpoints with examples
  const apiEndpoints: ApiEndpoint[] = [
    {
      method: "GET",
      name: "Get All Records",
      url: `/api/${contentTypeId}/records`,
      description: "Retrieve all records from the collection with optional filtering and pagination",
      queryParams: [
        { name: "page", type: "number", description: "Page number for pagination", example: "1" },
        { name: "limit", type: "number", description: "Number of records per page", example: "10" },
        { name: "sort", type: "string", description: "Sort field and direction", example: "name:asc" },
        { name: "filter", type: "string", description: "Filter records", example: "salary[gte]=50000" },
      ],
      responseExample: {
        data: [
          {
            id: "1",
            empId: "E001",
            name: "Tushar",
            salary: 50000,
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T10:30:00Z",
          },
          {
            id: "2",
            empId: "E002",
            name: "Shivam",
            salary: 45000,
            createdAt: "2024-01-14T09:20:00Z",
            updatedAt: "2024-01-14T09:20:00Z",
          },
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 1,
            total: 2,
          },
        },
      },
      codeExamples: {
        javascript: `// Using fetch API
const response = await fetch('/api/${contentTypeId}/records?page=1&limit=10', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);

// Using axios
import axios from 'axios';

const { data } = await axios.get('/api/${contentTypeId}/records', {
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN'
  },
  params: {
    page: 1,
    limit: 10,
    sort: 'name:asc'
  }
});`,
        curl: `curl -X GET "/api/${contentTypeId}/records?page=1&limit=10" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json"`,
        python: `import requests

url = "/api/${contentTypeId}/records"
headers = {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "Content-Type": "application/json"
}
params = {
    "page": 1,
    "limit": 10,
    "sort": "name:asc"
}

response = requests.get(url, headers=headers, params=params)
data = response.json()
print(data)`,
      },
    },
    {
      method: "POST",
      name: "Create New Record",
      url: `/api/${contentTypeId}/createRecord`,
      description: "Create a new record in the collection",
      requestBody: {
        empId: "E009",
        name: "John Doe",
        salary: 55000,
      },
      responseExample: {
        data: {
          id: "9",
          empId: "E009",
          name: "John Doe",
          salary: 55000,
          createdAt: "2024-01-16T14:25:00Z",
          updatedAt: "2024-01-16T14:25:00Z",
        },
        meta: {},
      },
      codeExamples: {
        javascript: `// Using fetch API
const newRecord = {
  empId: "E009",
  name: "John Doe",
  salary: 55000
};

const response = await fetch('/api/${contentTypeId}/createRecord', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newRecord)
});

const data = await response.json();
console.log(data);

// Using axios
import axios from 'axios';

const { data } = await axios.post('/api/${contentTypeId}/createRecord', {
  empId: "E009",
  name: "John Doe",
  salary: 55000
}, {
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN'
  }
});`,
        curl: `curl -X POST "/api/${contentTypeId}/createRecord" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "empId": "E009",
    "name": "John Doe",
    "salary": 55000
  }'`,
        python: `import requests
import json

url = "/api/${contentTypeId}/createRecord"
headers = {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "Content-Type": "application/json"
}
data = {
    "empId": "E009",
    "name": "John Doe",
    "salary": 55000
}

response = requests.post(url, headers=headers, data=json.dumps(data))
result = response.json()
print(result)`,
      },
    },
    {
      method: "GET",
      name: "Get Schema Fields",
      url: `/api/${contentTypeId}/fields`,
      description: "Retrieve the schema definition and field information for this collection",
      responseExample: {
        data: {
          contentType: "employee",
          displayName: "Employee",
          description: "Employee records and information",
          fields: [
            {
              name: "empId",
              type: "text",
              required: true,
              unique: true,
              description: "Employee ID",
            },
            {
              name: "name",
              type: "text",
              required: true,
              unique: false,
              description: "Employee full name",
            },
            {
              name: "salary",
              type: "number",
              required: true,
              unique: false,
              description: "Employee salary",
            },
          ],
        },
        meta: {},
      },
      codeExamples: {
        javascript: `// Get schema information
const response = await fetch('/api/${contentTypeId}/fields', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  }
});

const schema = await response.json();
console.log('Schema fields:', schema.data.fields);`,
        curl: `curl -X GET "/api/${contentTypeId}/fields" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json"`,
        python: `import requests

url = "/api/${contentTypeId}/fields"
headers = {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
schema = response.json()
print("Schema fields:", schema["data"]["fields"])`,
      },
    },
    {
      method: "PUT",
      name: "Update Record",
      url: `/api/${contentTypeId}/updateRecord/{recordId}`,
      description: "Update an existing record by its ID",
      requestBody: {
        name: "John Smith",
        salary: 60000,
      },
      responseExample: {
        data: {
          id: "1",
          empId: "E001",
          name: "John Smith",
          salary: 60000,
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-16T15:45:00Z",
        },
        meta: {},
      },
      codeExamples: {
        javascript: `// Update a record
const recordId = "1";
const updates = {
  name: "John Smith",
  salary: 60000
};

const response = await fetch(\`/api/${contentTypeId}/updateRecord/\${recordId}\`, {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updates)
});

const data = await response.json();
console.log(data);`,
        curl: `curl -X PUT "/api/${contentTypeId}/updateRecord/1" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Smith",
    "salary": 60000
  }'`,
        python: `import requests
import json

record_id = "1"
url = f"/api/${contentTypeId}/updateRecord/{record_id}"
headers = {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "Content-Type": "application/json"
}
data = {
    "name": "John Smith",
    "salary": 60000
}

response = requests.put(url, headers=headers, data=json.dumps(data))
result = response.json()
print(result)`,
      },
    },
    {
      method: "DELETE",
      name: "Delete Record",
      url: `/api/${contentTypeId}/deleteRecord/{recordId}`,
      description: "Delete a record by its ID",
      responseExample: {
        data: {
          id: "1",
          deleted: true,
        },
        meta: {
          message: "Record deleted successfully",
        },
      },
      codeExamples: {
        javascript: `// Delete a record
const recordId = "1";

const response = await fetch(\`/api/${contentTypeId}/deleteRecord/\${recordId}\`, {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
        curl: `curl -X DELETE "/api/${contentTypeId}/deleteRecord/1" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json"`,
        python: `import requests

record_id = "1"
url = f"/api/${contentTypeId}/deleteRecord/{record_id}"
headers = {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "Content-Type": "application/json"
}

response = requests.delete(url, headers=headers)
result = response.json()
print(result)`,
      },
    },
  ]

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500 hover:bg-green-600"
      case "POST":
        return "bg-blue-500 hover:bg-blue-600"
      case "PUT":
        return "bg-amber-500 hover:bg-amber-600"
      case "DELETE":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const handleCopyCode = (code: string, endpointIndex: number, language: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(`${endpointIndex}-${language}`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getLanguageForEndpoint = (endpointIndex: number) => {
    return selectedLanguage[endpointIndex] || "javascript"
  }

  const setLanguageForEndpoint = (endpointIndex: number, language: string) => {
    setSelectedLanguage((prev) => ({
      ...prev,
      [endpointIndex]: language,
    }))
  }

  return (
    <div className="space-y-6">
      {/* API Overview */}
      <Card className="border-l-4 border-l-[#4945ff]">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Book className="w-5 h-5 text-[#4945ff]" />
            <CardTitle>API Documentation</CardTitle>
          </div>
          <CardDescription>
            Complete API reference for {contentTypeName} collection. All endpoints require authentication via Bearer
            token.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-800">Base URL</div>
              <div className="text-blue-600 font-mono">https://your-api.com</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-green-800">Content Type</div>
              <div className="text-green-600">application/json</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-medium text-purple-800">Authentication</div>
              <div className="text-purple-600">Bearer Token</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      {apiEndpoints.map((endpoint, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge className={`${getMethodColor(endpoint.method)} text-white px-3 py-1`}>{endpoint.method}</Badge>
                <div>
                  <h3 className="font-semibold text-lg">{endpoint.name}</h3>
                  <p className="text-sm text-gray-600">{endpoint.description}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-gray-900 rounded-lg">
              <code className="text-green-400 font-mono text-sm">{endpoint.url}</code>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs defaultValue="example" className="w-full">
              <div className="px-6 pt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="example">Example</TabsTrigger>
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="params">Parameters</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="example" className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Code Examples</h4>
                    <div className="flex space-x-1">
                      {["javascript", "curl", "python"].map((lang) => (
                        <Button
                          key={lang}
                          variant={getLanguageForEndpoint(index) === lang ? "default" : "outline"}
                          size="sm"
                          onClick={() => setLanguageForEndpoint(index, lang)}
                          className="capitalize"
                        >
                          {lang === "javascript" ? "JavaScript" : lang === "curl" ? "cURL" : "Python"}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>
                        {endpoint.codeExamples[getLanguageForEndpoint(index) as keyof typeof endpoint.codeExamples]}
                      </code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() =>
                        handleCopyCode(
                          endpoint.codeExamples[getLanguageForEndpoint(index) as keyof typeof endpoint.codeExamples],
                          index,
                          getLanguageForEndpoint(index),
                        )
                      }
                    >
                      {copiedCode === `${index}-${getLanguageForEndpoint(index)}` ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="request" className="px-6 pb-6">
                {endpoint.requestBody ? (
                  <div className="space-y-4">
                    <h4 className="font-medium">Request Body</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{JSON.stringify(endpoint.requestBody, null, 2)}</code>
                    </pre>
                  </div>
                ) : (
                  <p className="text-gray-600">No request body required for this endpoint.</p>
                )}
              </TabsContent>

              <TabsContent value="response" className="px-6 pb-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Response Example</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{JSON.stringify(endpoint.responseExample, null, 2)}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="params" className="px-6 pb-6">
                {endpoint.queryParams ? (
                  <div className="space-y-4">
                    <h4 className="font-medium">Query Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-4 py-2 text-left">Parameter</th>
                            <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                            <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                            <th className="border border-gray-200 px-4 py-2 text-left">Example</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.queryParams.map((param, paramIndex) => (
                            <tr key={paramIndex}>
                              <td className="border border-gray-200 px-4 py-2 font-mono text-sm">{param.name}</td>
                              <td className="border border-gray-200 px-4 py-2">
                                <Badge variant="outline">{param.type}</Badge>
                              </td>
                              <td className="border border-gray-200 px-4 py-2 text-sm">{param.description}</td>
                              <td className="border border-gray-200 px-4 py-2 font-mono text-sm text-blue-600">
                                {param.example}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No query parameters available for this endpoint.</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ))}

      {/* Authentication Guide */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-amber-500" />
            <CardTitle>Authentication</CardTitle>
          </div>
          <CardDescription>How to authenticate your API requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium text-amber-800 mb-2">API Token Required</h4>
            <p className="text-sm text-amber-700">
              All API requests must include a valid API token in the Authorization header. You can generate API tokens
              in Settings → API Tokens.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Header Format</h4>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm">
              <code>Authorization: Bearer YOUR_API_TOKEN</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Error Response (401 Unauthorized)</h4>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm">
              <code>
                {JSON.stringify(
                  {
                    error: {
                      status: 401,
                      name: "UnauthorizedError",
                      message: "Missing or invalid credentials",
                    },
                  },
                  null,
                  2,
                )}
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
