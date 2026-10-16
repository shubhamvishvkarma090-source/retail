# API quick reference
All endpoints except `/api/auth/login` and `/api/health` require `Authorization: Bearer <token>`.

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Sign in |
| GET | `/api/auth/me` | Authenticated | Current user |
| GET | `/api/products` | Authenticated | Search/filter/paginate products |
| GET | `/api/products/:id` | Authenticated | Product details |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| PATCH | `/api/products/:id/status` | Admin | Activate/deactivate |
| GET | `/api/inventory/low-stock` | Authenticated | Low-stock products |
| POST | `/api/inventory/adjustments` | Authenticated | Receive/increase/decrease stock |
| GET | `/api/inventory/movements` | Authenticated | Movement history |
| POST | `/api/sales` | Authenticated | Create sale |
| GET | `/api/sales` | Authenticated | Sales history |
| GET | `/api/sales/:id` | Authenticated | Sale/invoice details |
| GET | `/api/reports/dashboard` | Admin | Dashboard summary |
| GET | `/api/reports/sales` | Admin | Sales totals |
| GET | `/api/reports/profit` | Admin | Gross profit |

List endpoints accept pagination; products support `search`, `category`, and `stockStatus=low|out`. Reports accept `from` and `to` dates.
