import { NextResponse } from "next/server";

if (process.env.NODE_ENV === "production") {
  // Blocked in production
}

const spec = {
  openapi: "3.0.0",
  info: { title: "Veltra API", version: "1.0.0", description: "Veltra webapp REST API" },
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Products", description: "Product management" },
    { name: "Categories", description: "Product categories" },
    { name: "Employees", description: "Employee management (admin only)" },
    { name: "Users", description: "User list (logged-in only)" },
    { name: "Messages", description: "Direct messages (logged-in only)" },
    { name: "Contact", description: "Public contact form" },
    { name: "Admin", description: "Admin-only stats" },
  ],
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Auth"], summary: "Login with email + password",
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" } }, required: ["email", "password"] } } } },
        responses: { "200": { description: "Session cookie set, returns user info" }, "400": { description: "Missing fields" }, "401": { description: "Invalid credentials" } },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"], summary: "Register a new user",
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, email: { type: "string" }, password: { type: "string" } }, required: ["name", "email", "password"] } } } },
        responses: { "201": { description: "User created" }, "400": { description: "Missing fields" }, "409": { description: "Email already in use" } },
      },
    },
    "/api/auth/logout": {
      post: { tags: ["Auth"], summary: "Clear session cookie", responses: { "200": { description: "Logged out" } } },
    },
    "/api/auth/me": {
      get: { tags: ["Auth"], summary: "Get current session user", responses: { "200": { description: "Session payload" }, "401": { description: "Not authenticated" } } },
    },
    "/api/products": {
      get: {
        tags: ["Products"], summary: "List all products (public)",
        parameters: [
          { name: "category", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: { "200": { description: "Array of products with category" } },
      },
      post: { tags: ["Products"], summary: "Create product (admin only)", responses: { "201": { description: "Product created" }, "400": { description: "Missing fields" }, "403": { description: "Forbidden" } } },
    },
    "/api/products/{id}": {
      get: { tags: ["Products"], summary: "Get single product (public)", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Product" }, "404": { description: "Not found" } } },
      put: { tags: ["Products"], summary: "Update product (admin only)", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Updated product" }, "403": { description: "Forbidden" } } },
      delete: { tags: ["Products"], summary: "Delete product (admin only)", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "204": { description: "Deleted" }, "403": { description: "Forbidden" } } },
    },
    "/api/categories": {
      get: { tags: ["Categories"], summary: "List all categories (public)", responses: { "200": { description: "Array of categories" } } },
    },
    "/api/employees": {
      get: { tags: ["Employees"], summary: "List employees (admin only)", responses: { "200": { description: "Array of employees" }, "403": { description: "Forbidden" } } },
      post: { tags: ["Employees"], summary: "Create employee (admin only)", responses: { "201": { description: "Employee created" }, "403": { description: "Forbidden" } } },
    },
    "/api/employees/{id}": {
      put: { tags: ["Employees"], summary: "Update employee (admin only)", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Updated" }, "403": { description: "Forbidden" } } },
      delete: { tags: ["Employees"], summary: "Delete employee (admin only)", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "204": { description: "Deleted" }, "403": { description: "Forbidden" } } },
    },
    "/api/users": {
      get: { tags: ["Users"], summary: "List users excluding self (logged-in only)", responses: { "200": { description: "Array of users" }, "401": { description: "Unauthorized" } } },
    },
    "/api/messages": {
      get: { tags: ["Messages"], summary: "Get conversation (logged-in only)", parameters: [{ name: "with", in: "query", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Array of messages" }, "401": { description: "Unauthorized" } } },
      post: { tags: ["Messages"], summary: "Send message (logged-in only)", responses: { "201": { description: "Message sent" }, "401": { description: "Unauthorized" } } },
    },
    "/api/contact": {
      post: { tags: ["Contact"], summary: "Submit contact form (public)", requestBody: { content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, message: { type: "string" } }, required: ["name", "message"] } } } }, responses: { "201": { description: "Contact saved" }, "400": { description: "Missing fields" } } },
    },
    "/api/admin/stats": {
      get: { tags: ["Admin"], summary: "Dashboard stats (admin only)", responses: { "200": { description: "totalProducts, totalEmployees, totalUsers, recentContacts" }, "403": { description: "Forbidden" } } },
    },
  },
};

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }
  return NextResponse.json(spec);
}
